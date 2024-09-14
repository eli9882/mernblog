/*require('dotenv').config(); 
const Post = require('../models/postModel')
const User = require('../models/userModel')
const path = require('path')
const fs = require('fs')
const { v4: uuid } = require("uuid")
const HttpError = require('../models/errorModel')
const { mongoose } = require('mongoose')
const cloudinary = require('cloudinary').v2;*/


//============================== CREATE NEW POST
// POST : api/posts/
// PROTECTED
/*const createPost = async (req, res, next) => {
    try {
        let {title, description} = req.body;
        if(!title || !description || !req.files) {
            return next(new HttpError("Rellene todos los campos y elija la imagen.", 422))
        }
        
        const {thumbnail} = req.files;
        // check file size
        if(thumbnail.size > 2000000) {
            return next(new HttpError("Imagen demasiado grande. El tamaño del archivo debe ser inferior a 2mb."))
        }
        
        let fileName;
        fileName = thumbnail.name;
        let splittedFilename = fileName.split('.')
        let newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1]
        thumbnail.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
            if(err) {
                return next(new HttpError(err))
            } else {
                const newPost = await Post.create({title, description, thumbnail: newFilename, creator: req.user.id});
                if(!newPost) {
                    return next(new HttpError("Algo salió mal.", 422))
                }
                // Find user and increase posts count by 1
                const currentUser = await User.findById(req.user.id)
                const userPostCount = currentUser?.posts + 1;
                await User.findByIdAndUpdate(req.user.id, {posts: userPostCount})

                res.status(201).json(newPost)
            }
        })
    } catch (error) {
        return next(new HttpError(error))
    }
}*/
require('dotenv').config(); 
const Post = require('../models/postModel'); 
const User = require('../models/userModel');
const fs = require('fs').promises;
const { v4: uuid } = require("uuid");
const HttpError = require('../models/errorModel');
const cloudinary = require('cloudinary').v2;
const path = require('path');

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//============================== CREATE NEW POST
const createPost = async (req, res, next) => {
    try {
        const { title, description } = req.body;

        // Verificar que se haya subido un archivo
        if (!req.files || !req.files.thumbnail) {
            return next(new HttpError("Rellene todos los campos y elija la imagen.", 422));
        }

        const { thumbnail } = req.files;

        // Verificar el tamaño del archivo
        if (thumbnail.size > 2000000) {
            return next(new HttpError("Imagen demasiado grande. El tamaño del archivo debe ser inferior a 2mb."));
        }

        // Subir la imagen a Cloudinary
        try {
            const result = await cloudinary.uploader.upload(thumbnail.tempFilePath, {
                folder: "uploads",
                public_id: uuid(),
                resource_type: "image"
            });

            // Eliminar el archivo temporal después de subirlo a Cloudinary
            await fs.unlink(thumbnail.tempFilePath);

            const newPost = await Post.create({
                title,
                description,
                thumbnail: result.secure_url, // Guardamos la URL segura de la imagen
                creator: req.user.id,
            });

            if (!newPost) {
                return next(new HttpError("Algo salió mal.", 422));
            }

            const currentUser = await User.findById(req.user.id);
            currentUser.posts += 1;
            await currentUser.save();

            res.status(201).json(newPost);
        } catch (err) {
            console.error("Error al subir la imagen a Cloudinary:", err.message);
            return next(new HttpError("Error al subir la imagen a Cloudinary.", 500));
        }
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};


//============================== GET ALL POSTS
// GET : api/posts/
// UNPROTECTED
const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({updatedAt: -1});
        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error))
    }
}




//============================== GET SINGLE POSTS
// GET : api/posts/:id
// UNPROTECTED
const getPost = async (req, res, next) => {
    try {
        const postID = req.params.id;
        const post = await Post.findById(postID);
        if(!post) {
            return next(new HttpError("Publicación no encontrado.", 404))
        }
        res.status(200).json(post);
    } catch (error) {
        return next(new HttpError(error));
    }
}


//============================== GET POSTS BY CATEGORY
// GET : api/posts/categories/:category
// UNPROTECTED
const getCatPosts = async (req, res, next) => {
    try {
        const {category} = req.params;
        const catPosts = await Post.find({category}).sort({createdAt: -1})
        res.json(catPosts)
    } catch (error) {
        return next(new HttpError(error))
    }
}


//============================== GET POSTS BY AUTHOR
// GET : api/posts/users/:id
// UNPROTECTED
const getUserPosts = async (req, res, next) => {
    const {id} = req.params;
    try {
        const posts = await Post.find({creator: id}).sort({createdAt: -1})
        res.json(posts)
    } catch (error) {
        return next(new HttpError(error))
    }
}





//============================== EDIT POST
// PATCH : api/posts/:id
// PROTECTED
/*const editPost = async (req, res, next) => {
    let fileName;
    let newFilename;
    let updatedPost
    try {
        const postID = req.params.id;
        let {title, description} = req.body;
        // ReactQuill has a paragraph opening and closing tag with a break tag in between so there are 11 characters in there already. That's why 12 
        if(!title || description.length < 12) {
            return next(new HttpError("Rellene todos los campos", 422))
        }
        
        // get old post from db
        const oldPost = await Post.findById(postID);

        if(req.user.id == oldPost.creator) {
            // update post without thumbnail
            if(!req.files) {
                updatedPost = await Post.findByIdAndUpdate(postID, {title, description}, {new: true})
            } else {
                // delete old thumbnail from uploads
                fs.unlink(path.join(__dirname, '..', 'uploads', oldPost.thumbnail), async (err) => {
                if (err) {
                    return next(new HttpError(err))
                }})
                
                // upload new thumbnail
                const {thumbnail} = req.files;
                // check file size
                if(thumbnail.size > 2000000) {
                    return next(new HttpError("Imagen demasiado grande. Debería pesar menos de 2mb"))
                }
                fileName = thumbnail.name;
                let splittedFilename = fileName.split('.')
                newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1]
                thumbnail.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
                    if(err) {
                        return next(new HttpError(err))
                    }
                })
        
                updatedPost = await Post.findByIdAndUpdate(postID, {title, description, thumbnail: newFilename}, {new: true})
            }
        } else {
            return next(new HttpError("No se ha podido actualizar la publicación.", 403))
        }

        if(!updatedPost) {
            return next(new HttpError("No se ha podido actualizar la publicación.", 400))
        }
        res.json(updatedPost)

    } catch (error) {
        return next(new HttpError(error))
    }
}*/

//============================== EDIT POST
// PATCH : api/posts/:id
// PROTECTED     
const editPost = async (req, res, next) => {
    let updatedPost;
    try {
        const postID = req.params.id;
        const { title, description } = req.body;

        if (!title || description.length < 12) {
            return next(new HttpError("Rellene todos los campos", 422));
        }

        const oldPost = await Post.findById(postID);
        if (!oldPost) {
            return next(new HttpError("Publicación no encontrada", 404));
        }

        // Verificar si el usuario es el creador
        if (req.user.id !== oldPost.creator.toString()) {
            return next(new HttpError("No autorizado para editar esta publicación.", 403));
        }

        // Si no se sube un nuevo archivo, solo se actualizan los campos de texto
        if (!req.files || !req.files.thumbnail) {
            updatedPost = await Post.findByIdAndUpdate(postID, { title, description }, { new: true });
        } else {
            const { thumbnail } = req.files;

            // Verificar el tamaño del archivo
            if (thumbnail.size > 2000000) {
                return next(new HttpError("Imagen demasiado grande. Debería pesar menos de 2mb"));
            }

            // Subir la nueva imagen a Cloudinary
            const result = await cloudinary.uploader.upload(thumbnail.tempFilePath, {
                folder: "uploads",
                public_id: uuid(),
                resource_type: "image",
            });

            // Eliminar el archivo temporal
            await fs.unlink(thumbnail.tempFilePath);

            // Actualizar la publicación con el nuevo thumbnail
            updatedPost = await Post.findByIdAndUpdate(
                postID,
                { title, description, thumbnail: result.secure_url },
                { new: true }
            );
        }

        if (!updatedPost) {
            return next(new HttpError("No se ha podido actualizar la publicación.", 400));
        }

        res.json(updatedPost);
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};






//============================== DELETE POST
// DELETE : api/posts/:id
// PROTECTED
/*const removePost = async (req, res, next) => {
    const postID = req.params.id;
    if(!postID) {
        return next(new HttpError("Publicación no disponible"))
    }
    const post = await Post.findById(postID);
    const fileName = post?.thumbnail;
    if(req.user.id == post.creator) {
        // delete thumbnail from uploads
    fs.unlink(path.join(__dirname, '..', 'uploads', fileName), async (err) => {
        if (err) {
            return next(err)
        } else {
            await Post.findByIdAndDelete(postID)
            // Find user and reduce posts count by 1
            const currentUser = await User.findById(req.user.id)
            const userPostCount = currentUser?.posts - 1;
            await User.findByIdAndUpdate(req.user.id, {posts: userPostCount})
            res.json("Publicación eliminada")
        }
        })
    } else {
        return next(new HttpError("No se puede eliminar la publicación.", 403))
    }
}*/
const removePost = async (req, res, next) => {
    const postID = req.params.id;

    if (!postID) {
        return next(new HttpError("Publicación no disponible", 404));
    }

    try {
        const post = await Post.findById(postID);
        if (!post) {
            return next(new HttpError("Publicación no encontrada", 404));
        }

        if (req.user.id === post.creator.toString()) {
            // Eliminar thumbnail de Cloudinary
            if (post.thumbnail) {
                const publicId = post.thumbnail.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
            }

            // Eliminar la publicación
            await Post.findByIdAndDelete(postID);

            // Encontrar al usuario y reducir el conteo de publicaciones por 1
            const currentUser = await User.findById(req.user.id);
            const userPostCount = currentUser?.posts - 1;
            await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });

            res.json({ message: "Publicación eliminada" });
        } else {
            return next(new HttpError("No se puede eliminar la publicación.", 403));
        }
    } catch (error) {
        console.error("Error al eliminar la publicación:", error);
        return next(new HttpError("Error al eliminar la publicación.", 500));
    }
};


module.exports = {getPosts, getPost, getCatPosts, getUserPosts, createPost, editPost, removePost}