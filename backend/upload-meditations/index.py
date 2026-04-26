import os
import json
import boto3
import urllib.request
from botocore.exceptions import ClientError

"""
Скачивает бесплатные аудиофайлы медитаций с archive.org и загружает их в S3.
Вызывается один раз для подготовки контента.
"""

MEDITATIONS = [
    {
        "key": "meditations/morning-energy.mp3",
        "url": "https://ia601905.us.archive.org/30/items/jamendo-559810/01-2153953-Crystal%20Wave-Binaural%20Meditation.mp3",
        "title": "Утреннее пробуждение",
    },
    {
        "key": "meditations/focus-gamma.mp3",
        "url": "https://ia600803.us.archive.org/21/items/meditation-gamma-binaural-waves-for-transcendental-focus-2/Meditation%20gamma%20binaural%20waves%20for%20transcendental%20focus%20%282%29.mp3",
        "title": "Фокус и ясность",
    },
    {
        "key": "meditations/calm-anxiety.mp3",
        "url": "https://ia600107.us.archive.org/12/items/ipc-calming-overthinking-396hz-theta-8d/23%20Min%20Calm%20Overthink%208d_mix.mp3",
        "title": "Снятие тревоги",
    },
]


def file_exists_in_s3(s3_client, key):
    try:
        s3_client.head_object(Bucket="files", Key=key)
        return True
    except ClientError:
        return False


def handler(event: dict, context) -> dict:
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )

    results = []
    access_key = os.environ["AWS_ACCESS_KEY_ID"]

    for med in MEDITATIONS:
        key = med["key"]
        cdn_url = f"https://cdn.poehali.dev/projects/{access_key}/bucket/{key}"

        if file_exists_in_s3(s3, key):
            results.append({"title": med["title"], "key": key, "url": cdn_url, "status": "already_exists"})
            continue

        req = urllib.request.Request(med["url"], headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = resp.read()

        s3.put_object(
            Bucket="files",
            Key=key,
            Body=data,
            ContentType="audio/mpeg",
        )

        results.append({"title": med["title"], "key": key, "url": cdn_url, "status": "uploaded"})

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({"success": True, "meditations": results}),
    }
