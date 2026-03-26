export default function AboutPage() {
  return (
    <div className='mx-auto max-w-5xl space-y-12 pb-12'>
      <section className='mt-8 space-y-4 text-center'>
        <h1 className='text-primary text-4xl font-bold tracking-tight md:text-5xl'>About Quizly</h1>
        <p className='text-surface-600 dark:text-surface-400 mx-auto max-w-3xl pt-4 text-xl leading-relaxed'>
          Quizly is a modern, fast, and interactive platform designed to make creating and taking
          quizzes effortless. Built to solve the frustration of slow, outdated testing apps, it
          delivers a seamless, real-time experience wrapped in a clean interface.
        </p>
      </section>

      <hr className='border-surface-200 dark:border-surface-700' />

      <section>
        <h2 className='mb-6 text-2xl font-bold'>Platform Features</h2>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          <div className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 rounded-xl border p-6 shadow-sm'>
            <i className='pi pi-bolt mb-4 text-3xl text-yellow-500' />
            <h3 className='mb-2 text-xl font-semibold'>Real-Time Interaction</h3>
            <p className='text-surface-600 dark:text-surface-400 text-md'>
              Instant feedback, dynamic scoring, and an interactive quiz-taking environment that
              doesn`t make you wait for page reloads.
            </p>
          </div>
          <div className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 rounded-xl border p-6 shadow-sm'>
            <i className='pi pi-chart-bar mb-4 text-3xl text-blue-500' />
            <h3 className='mb-2 text-xl font-semibold'>Comprehensive Dashboard</h3>
            <p className='text-surface-600 dark:text-surface-400 text-md'>
              A powerful workspace for managing projects, analyzing score data, and organizing your
              quiz content.
            </p>
          </div>
          <div className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 rounded-xl border p-6 shadow-sm'>
            <i className='pi pi-mobile mb-4 text-3xl text-green-500' />
            <h3 className='mb-2 text-xl font-semibold'>Responsive Design</h3>
            <p className='text-surface-600 dark:text-surface-400 text-md'>
              A fully fluid, mobile-first interface featuring an off-canvas navigation system that
              looks great on any screen size.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className='mb-6 text-2xl font-bold'>Under the Hood</h2>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='bg-surface-50 dark:bg-surface-800 border-surface-200 dark:border-surface-700 rounded-xl border p-6'>
            <h3 className='mb-4 flex items-center gap-2 text-lg font-bold'>
              <i className='pi pi-desktop' /> Frontend Engine
            </h3>
            <ul className='text-md text-surface-700 dark:text-surface-300 space-y-3'>
              <li>
                <strong>Framework:</strong> Next.js (App Router) for hybrid static/server rendering.
              </li>
              <li>
                <strong>Styling:</strong> Tailwind CSS combined with PrimeReact headless components.
              </li>
              <li>
                <strong>State & Layout:</strong> Advanced Next.js Route Groups
              </li>
            </ul>
          </div>

          <div className='bg-surface-50 dark:bg-surface-800 border-surface-200 dark:border-surface-700 rounded-xl border p-6'>
            <h3 className='mb-4 flex items-center gap-2 text-lg font-bold'>
              <i className='pi pi-server' /> Backend & Infrastructure
            </h3>
            <ul className='text-md text-surface-700 dark:text-surface-300 space-y-3'>
              <li>
                <strong>Architecture:</strong> Nest.js running a robust API layer.
              </li>
              <li>
                <strong>Database:</strong> PostgreSQL handling relational data storage securely.
              </li>
              <li>
                <strong>Deployment:</strong> Fully containerized standalone builds via Docker,
                provisioned on AWS infrastructure.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
