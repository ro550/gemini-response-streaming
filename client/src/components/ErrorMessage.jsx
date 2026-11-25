// client/src/components/ErrorMessage.jsx
export default function ErrorMessage({ error, onRetry }) {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[80%] bg-red-50 border border-red-200 rounded-2xl rounded-bl-md px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <div>
            <p className="text-red-800 font-medium mb-1">
              Something went wrong
            </p>
            <p className="text-red-600 text-sm mb-3">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-sm px-4 py-1.5 bg-red-100 text-red-700 rounded-lg
                           hover:bg-red-200 transition-colors"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}