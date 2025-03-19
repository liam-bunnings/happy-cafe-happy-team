export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Restaurant Menu System</h1>
      <p className="text-xl mb-4">Welcome to the Restaurant Menu System</p>
      <div className="flex gap-4">
        <a href="/restaurant" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Restaurant Portal
        </a>
        <a href="/customer" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Customer Portal
        </a>
      </div>
    </main>
  );
}
