interface TimerPageProps {
  params: { id: string };
}

export default function TimerPage({ params }: TimerPageProps) {

  return (
    <div>
      <h1>Timer for {params.id}</h1>
    </div>
  );
}
