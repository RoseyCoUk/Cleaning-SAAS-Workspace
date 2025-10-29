"use client";
import React, { useState } from "react";
import { CheckCircleIcon, CloseIcon, PencilIcon, ChatIcon } from "@/icons";

interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  responded: boolean;
  response?: string;
}

// Sample reviews data
const sampleReviews: Review[] = [
  {
    id: "1",
    clientName: "Sarah Johnson",
    rating: 5,
    comment: "Excellent service! The team was thorough and professional. My home looks spotless!",
    date: "Dec 20, 2024",
    responded: true,
    response: "Thank you so much for your kind words, Sarah! We're thrilled you're happy with our service.",
  },
  {
    id: "2",
    clientName: "Michael Chen",
    rating: 4,
    comment: "Good cleaning overall, but arrived 15 minutes late. Otherwise very satisfied.",
    date: "Dec 18, 2024",
    responded: false,
  },
  {
    id: "3",
    clientName: "Emily Davis",
    rating: 5,
    comment: "Best cleaning service we've ever used. Highly recommend!",
    date: "Dec 15, 2024",
    responded: true,
    response: "We appreciate your recommendation, Emily! Thank you!",
  },
  {
    id: "4",
    clientName: "Robert Wilson",
    rating: 3,
    comment: "Service was okay, but missed some spots in the bathroom.",
    date: "Dec 12, 2024",
    responded: false,
  },
  {
    id: "5",
    clientName: "Lisa Martinez",
    rating: 5,
    comment: "Amazing! They went above and beyond expectations.",
    date: "Dec 10, 2024",
    responded: true,
    response: "Thank you, Lisa! We always strive to exceed expectations!",
  },
];

export const ReviewsTab = () => {
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");

  // Calculate KPIs
  const totalReviews = reviews.length;
  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1);
  const pendingResponses = reviews.filter((r) => !r.responded).length;

  const handleSubmitResponse = (reviewId: string) => {
    setReviews(
      reviews.map((r) =>
        r.id === reviewId ? { ...r, responded: true, response: responseText } : r
      )
    );
    setRespondingTo(null);
    setResponseText("");
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{averageRating}</p>
                <svg className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reviews</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{totalReviews}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <ChatIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Responses</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{pendingResponses}</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <PencilIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6"
          >
            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {review.clientName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{review.date}</p>
              </div>
              <div className="flex items-center gap-3">
                {renderStars(review.rating)}
                {review.responded && (
                  <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <CheckCircleIcon className="w-4 h-4" />
                    Responded
                  </span>
                )}
              </div>
            </div>

            {/* Review Comment */}
            <p className="text-gray-700 dark:text-gray-300 mb-4">{review.comment}</p>

            {/* Response Section */}
            {review.responded && review.response ? (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-l-4 border-brand-600">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Your Response:</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{review.response}</p>
              </div>
            ) : respondingTo === review.id ? (
              <div className="mt-4 space-y-3">
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Write your response..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                  rows={3}
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSubmitResponse(review.id)}
                    disabled={!responseText.trim()}
                    className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send Response
                  </button>
                  <button
                    onClick={() => {
                      setRespondingTo(null);
                      setResponseText("");
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setRespondingTo(review.id)}
                className="flex items-center gap-2 px-4 py-2 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/10 rounded-lg transition-colors"
              >
                <PencilIcon className="w-4 h-4" />
                Respond to Review
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {reviews.length === 0 && (
        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No reviews yet</p>
        </div>
      )}
    </div>
  );
};
