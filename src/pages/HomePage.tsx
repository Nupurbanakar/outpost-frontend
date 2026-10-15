function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-primary-900 mb-4">
          Welcome to Outpost
        </h1>
        <p className="text-xl text-primary-700 mb-8">
          Empowering Indian Founders
        </p>
        <div className="card max-w-md mx-auto">
          <p className="text-gray-600">
            🚀 Project setup complete! Ready to build amazing features.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>✅ React 18 + TypeScript</p>
            <p>✅ Vite for fast dev experience</p>
            <p>✅ Tailwind CSS for styling</p>
            <p>✅ React Router for navigation</p>
            <p>✅ React Query for data fetching</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
