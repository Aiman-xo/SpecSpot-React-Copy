import React, { useState, useRef } from 'react';

const reviews = [
    {
        id: 1,
        name: 'Lionel Messi',
        initial: 'L',
        text: 'These glasses are lightweight and super comfortable to wear all day. The lenses are crystal clear and reduce eye strain, even after hours of screen time. Stylish design gets me compliments everywhere I go!',
        rating: 4,
        bgColor: 'bg-amber-500'
    },
    {
        id: 2,
        name: 'Ashraf',
        initial: 'A',
        text: 'I absolutely loved using this app! The interface is super clean and easy to navigate. The notifications are quick, and I really appreciate how smooth everything feels. Definitely recommend it to anyone looking for a hassle-free experience!',
        rating: 5,
        bgColor: 'bg-gray-500'
    },
    {
        id: 3,
        name: 'Cristiano Ronaldo',
        initial: 'C',
        text: 'Fantastic service! Everything worked exactly as promised and even exceeded my expectations. The little details really make a big difference. I’ll definitely be coming back and recommending this to friends.',
        rating: 5,
        bgColor: 'bg-red-500'
    }
];

function Review() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [expanded, setExpanded] = useState({});
    const scrollRef = useRef(null);

    const cardWidth = 288; // card width + gap in px

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const scrollLeft = scrollRef.current.scrollLeft;
        const index = Math.round(scrollLeft / cardWidth);
        setActiveIndex(index);
    };

    const scrollToIndex = (index) => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollTo({
            left: cardWidth * index,
            behavior: 'smooth'
        });
    };

    const toggleReadMore = (id) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="max-w-6xl mx-auto mt-12 px-4">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">What Our Users Say</h2>

            {/* Desktop & Tablet: Grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-6">
                {reviews.map((review) => (
                    <div key={review.id} className="p-6 rounded-xl shadow-lg bg-white hover:shadow-xl transition">
                        <div className="flex items-center mb-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${review.bgColor}`}>
                                {review.initial}
                            </div>
                            <div className="ms-3">
                                <p className="font-semibold text-gray-800">{review.name}</p>
                                <p className="text-xs text-gray-500">Verified Buyer</p>
                            </div>
                        </div>
                        <p className="text-gray-700 text-sm mb-4">{review.text}</p>
                        <div className="flex text-amber-400" aria-label="User rating">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile: Horizontal Scroll with Dots & Read More */}
            <div className="md:hidden">
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="overflow-x-auto flex gap-4 pb-4 snap-x snap-mandatory scroll-smooth"
                >
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="min-w-[280px] p-4 rounded-xl shadow-md bg-white flex-shrink-0 snap-start"
                            style={{ width: '280px' }}
                        >
                            <div className="flex items-center mb-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${review.bgColor}`}>
                                    {review.initial}
                                </div>
                                <div className="ms-3">
                                    <p className="font-semibold text-gray-800 text-sm">{review.name}</p>
                                    <p className="text-xs text-gray-500">Verified Buyer</p>
                                </div>
                            </div>

                            <p
                                className={`text-gray-700 text-xs mb-2 overflow-hidden transition-max-height duration-500 ease-in-out ${expanded[review.id] ? 'max-h-96' : 'max-h-16'
                                    }`}
                                style={{ whiteSpace: 'normal', width: 'auto' }}
                            >
                                {expanded[review.id] ? review.text : `${review.text.slice(0, 80)}...`}
                            </p>

                            <button
                                onClick={() => toggleReadMore(review.id)}
                                className="text-blue-500 text-xs font-semibold mb-2"
                            >
                                {expanded[review.id] ? 'Read Less' : 'Read More'}
                            </button>
                            <div className="flex text-amber-400" aria-label="User rating">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dots */}
                <div className="flex justify-center mt-2 gap-2">
                    {reviews.map((_, i) => (
                        <span
                            key={i}
                            onClick={() => scrollToIndex(i)}
                            className={`w-3 h-3 rounded-full cursor-pointer transition-all ${i === activeIndex ? 'bg-gray-800' : 'bg-gray-400'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Review;
