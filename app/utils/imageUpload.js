const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function imageUpload(reviewImg) {
    const res = await fetch(`${baseUrl}/upload-images`, {
        method: 'POST',
        body: reviewImg,
    });

    const data = await res.json();
    return Response.json(data);
}

export async function imageDelete(filename) {
    const res = await fetch(`${baseUrl}/delete-image?filename=${filename}`, {
        method: 'DELETE',
        body: filename,
    });

    const data = await res.json();
    return Response.json(data);
}
