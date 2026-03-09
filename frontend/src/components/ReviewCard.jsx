import { FiStar, FiUser } from 'react-icons/fi';

const ReviewCard = ({ review }) => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className="border-b border-dark-100 pb-6 last:border-0">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-dark-300 to-dark-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {review.user?.name ? review.user.name[0].toUpperCase() : <FiUser />}
        </div>
        <div>
          <p className="font-semibold text-dark-800 text-sm">{review.user?.name || 'Anonymous'}</p>
          <p className="text-dark-400 text-xs">{formatDate(review.createdAt)}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            size={14}
            className={star <= review.rating ? 'text-dark-800 fill-dark-800' : 'text-dark-300'}
          />
        ))}
      </div>
      <p className="text-dark-600 text-sm leading-relaxed">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;
