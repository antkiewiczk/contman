export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div 
        data-testid="loading-spinner"
        className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"
      ></div>
    </div>
  );
};