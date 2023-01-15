import { locenv } from "./environments";

export const uploadAsBase64 = (file: File) => {
    console.log(`uploadAsBase64`);
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
            var re = /data:[^\/]*\/[^;]*;base64,/gi;
            var encodedImageFull = reader.result as string;
            var encodedImage = encodedImageFull.replace(re, ``);
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${locenv.ImgBBAPIKey}`, {
                method: `POST`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                },
                body: `image=${encodeURIComponent(encodedImage)}`
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`Final uploaded URL: `, data.data);
                resolve({
                    success: 1,
                    file: {
                        url: data.data.url,
                    }
                });
            } else {
                reject();
            }
        };
        reader.readAsDataURL(file);
    });
};

export const uploadByURL = (file: string) => {
    console.log(`uploadByURL`);
    return new Promise((resolve, reject) => {
        resolve({
            success: 1,
            file: {
                url: file,
            }
        });
    });
};