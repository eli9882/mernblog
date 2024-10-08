import React from 'react';
import { Link } from 'react-router-dom';
import PostAuthor from './PostAuthor';

const PostItem = ({ thumbnail, postID, title, description, authorID, createdAt }) => {
    const shortDescription = description.length > 145 ? description.substr(0, 145) + '...' : description;
    const postTitle = title.length > 30 ? title.substr(0, 30) + "..." : title;

    return (
        <article className='post'>
            <div className="post__thumbnail">
                <img src={thumbnail} alt={title} /> {/* Usamos directamente el campo 'thumbnail' que ya tiene la URL de Cloudinary */}
            </div>
            <div className="post__content">
                <Link to={`/posts/${postID}`} className='post__content-link'>
                    <h3>{postTitle}</h3>
                </Link>
                <p dangerouslySetInnerHTML={{ __html: shortDescription }} />
                <div className="post__footer">
                    <PostAuthor authorID={authorID} createdAt={createdAt} />
                </div>
            </div>
        </article>
    );
}

export default PostItem;
