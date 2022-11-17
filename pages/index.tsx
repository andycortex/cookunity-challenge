import Head from 'next/head'
import { useState } from 'react'
import styles from '../styles/Home.module.css'
import { Event } from '../types'

type Schedule = Map<string, Map<string, Event>>
export default function Home() {
  const [date, setDate] = useState<Date>(() => new Date)
  const [schedule, setSchedule] = useState<Schedule>(() => new Map())

  function handleMonthChange(offset: number) {
    const draft = new Date(date);
    draft.setMonth(draft.getMonth() + offset)
    setDate(draft)
  }

  function HandleNewEvent(key: string) {
    const draft = new Map(schedule)
    if (!draft.has(key)) {
      draft.set(key, new Map())
    }
    const day = draft.get(key)!;
    const id = String(+new Date())
    const title = window.prompt('Event title')

    if (!title) return

    day.set(id, {
      id,
      title,
      date: new Date()
    })
    setSchedule(draft)
  }
  function handleDeleteEvent(key: string, id: string) {
    const draft = new Map(schedule)
    const day = draft.get(key)!
    day.delete(id)
    setSchedule(draft)
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <nav className={styles.nav}>
          <button onClick={() => handleMonthChange(-1)}>←</button>
          {date.toLocaleDateString('es-BO', { month: 'long', year: 'numeric' })}
          <button onClick={() => handleMonthChange(1)}>→</button>
          <button onClick={() => setDate(new Date())}>TODAY</button>
        </nav>
        <div className={styles.calendar}>
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i}>{new Date(date.getFullYear(), date.getMonth(), i + 1).toLocaleDateString('es-BO', { weekday: 'long' })}</div>
          ))}
          {Array.from({ length: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() }, (_, i) => {
            const key = `${date.getFullYear()}/${date.getMonth()}/${i + 1}`;
            const events = schedule.get(key);
            return (
              <div onClick={() => HandleNewEvent(key)} key={i} className={styles.day}>
                {i + 1}
                {events && (
                  <div>
                    {Array.from(events.values()).map((event) => (
                      <div onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvent(key, event.id);
                      }} key={event.id}>{event.title}</div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
