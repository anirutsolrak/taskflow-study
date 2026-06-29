import Link from "next/link";


export default function Home() {
  return (
    <main>
      <h1>Taskflow</h1>
      <p>Gerencie suas tarefas</p>
      <div className="flex gap-4">
        <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </Link>
        <Link href="/registro" className="bg-green-500 text-white px-4 py-2 rounded">
          Registro
        </Link>
      </div>
    </main>
  );
}