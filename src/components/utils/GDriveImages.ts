
export const uploadAsBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = function () {
            console.log('RESULT', reader.result);
            resolve({
                success: 1,
                file: {
                    url: reader.result,
                }
            });
        }
        reader.readAsDataURL(file);
        console.log(file);
    });
};