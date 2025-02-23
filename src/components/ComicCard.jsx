import React from 'react';

const ComicCard = ({ comic }) => { 
    return (
        <div className="group relative w-full h-40 bg-white shadow-lg rounded-lg flex items-center justify-center overflow-hidden">
            <img
                src={comic.img}
                alt={comic.title}
                className="absolute w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-300"
            />
            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                <h2 className="font-bold">{comic.title}</h2>
                <p>{comic.info}</p>
            </div>
        </div>
    );
}

export default ComicCard;
