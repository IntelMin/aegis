const uploadImage = async (newImage: File | null) => {
    if (!newImage) {
        console.error("No image selected");
        return;
    }
    if (
        !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
        !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    ) {
        console.error("No API key provided");
        return;
    }

    const imageData = new FormData();
    imageData.append("file", newImage);
    imageData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );
    imageData.append(
        "cloud_name",
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    );
    imageData.append("folder", "Cloudinary-React");

    try {
        const uploadResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: imageData,
            }
        );
        const uploadedImageData = await uploadResponse.json();
        return uploadedImageData.secure_url;
    } catch (error) {
        console.log(error, "Error while image upload");
    }
};

export default uploadImage
