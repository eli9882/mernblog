require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage() {
    try {
        // Construye la ruta de forma segura
        const imagePath = path.join('C:', 'Users', 'ruthf', 'Downloads', 'WhatsApp Image 2024-09-06 at 5.11.36 PM (2).jpeg');

        // Verificar si el archivo existe
        fs.access(imagePath, fs.constants.F_OK, async (err) => {
            if (err) {
                console.error("El archivo no existe en la ruta proporcionada:", imagePath);
                return;
            }

            console.log("El archivo existe en la ruta proporcionada.");

            // Subir la imagen a Cloudinary
            const result = await cloudinary.uploader.upload(imagePath, {
                folder: "test_uploads",
                resource_type: "image"
            });

            console.log("Resultado de la subida:", result);

            // Obtener la URL optimizada de la imagen
            const optimizeUrl = cloudinary.url(result.public_id, {
                fetch_format: 'auto',
                quality: 'auto'
            });
            console.log("URL optimizada de la imagen:", optimizeUrl);
        });
    } catch (error) {
        console.error("Error al subir la imagen:", error.message);
    }
}

uploadImage();
