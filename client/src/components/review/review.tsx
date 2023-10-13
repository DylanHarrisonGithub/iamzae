import React from "react";

type ReviewProps = {
  reviewerName: string;
  reviewText: string;
  rating: number;
  date: Date;
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={`text-2xl ${index < rating ? "text-yellow-500" : "text-gray-400"}`}>&#9733;</span>
  ));

  return <div>{stars}</div>;
};

const ReviewComponent: React.FC<ReviewProps> = ({ reviewerName, reviewText, rating, date }) => {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);

  return (
    <div className="bg-white p-4 rounded shadow mx-auto">
      <h3 className="text-xl font-semibold mb-2 text-black">{reviewerName}</h3>
      <StarRating rating={rating} />
      <p className="text-gray-700 mt-2">{reviewText}</p>
      <p className="text-gray-500 mt-2">{formattedDate}</p>
    </div>
  );
};

export default ReviewComponent;
