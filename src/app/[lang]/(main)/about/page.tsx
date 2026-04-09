import { getMessages } from 'next-intl/server';

export default async function AboutPage() {
  const dictionary = await getMessages();

  return (
    <div className='mx-auto max-w-5xl space-y-12 pb-12'>
      <section className='mt-8 space-y-4 text-center'>
        <h1 className='text-primary text-4xl font-bold tracking-tight md:text-5xl'>
          {dictionary.about.title}
        </h1>

        <p className='text-surface-600 dark:text-surface-400 mx-auto max-w-3xl pt-4 text-xl leading-relaxed'>
          {dictionary.about.description}
        </p>
      </section>

      <hr className='border-surface-200 dark:border-surface-700' />

      <section>
        <h2 className='mb-6 text-2xl font-bold'>{dictionary.about.title}</h2>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          <div className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 rounded-xl border p-6 shadow-sm'>
            <i className='pi pi-bolt mb-4 text-3xl text-yellow-500' />

            <h3 className='mb-2 text-xl font-semibold'>
              {dictionary.about.features.interactions.title}
            </h3>

            <p className='text-surface-600 dark:text-surface-400 text-md'>
              {dictionary.about.features.interactions.description}
            </p>
          </div>

          <div className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 rounded-xl border p-6 shadow-sm'>
            <i className='pi pi-chart-bar mb-4 text-3xl text-blue-500' />

            <h3 className='mb-2 text-xl font-semibold'>
              {dictionary.about.features.analytics.title}
            </h3>

            <p className='text-surface-600 dark:text-surface-400 text-md'>
              {dictionary.about.features.analytics.description}
            </p>
          </div>

          <div className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 rounded-xl border p-6 shadow-sm'>
            <i className='pi pi-mobile mb-4 text-3xl text-green-500' />

            <h3 className='mb-2 text-xl font-semibold'>{dictionary.about.features.design.title}</h3>

            <p className='text-surface-600 dark:text-surface-400 text-md'>
              {dictionary.about.features.design.description}
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className='mb-6 text-2xl font-bold'>{dictionary.about.techStack.title}</h2>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='bg-surface-50 dark:bg-surface-800 border-surface-200 dark:border-surface-700 rounded-xl border p-6'>
            <h3 className='mb-4 flex items-center gap-2 text-lg font-bold'>
              <i className='pi pi-desktop' /> {dictionary.about.techStack.frontend.title}
            </h3>

            <ul className='text-md text-surface-700 dark:text-surface-300 space-y-3'>
              <li>
                <strong>{dictionary.about.techStack.frontend.framework.title}</strong>
                {dictionary.about.techStack.frontend.framework.description}
              </li>

              <li>
                <strong>{dictionary.about.techStack.frontend.styling.title}</strong>
                {dictionary.about.techStack.frontend.styling.description}
              </li>

              <li>
                <strong>{dictionary.about.techStack.frontend.layout.title}</strong>
                {dictionary.about.techStack.frontend.layout.description}
              </li>
            </ul>
          </div>

          <div className='bg-surface-50 dark:bg-surface-800 border-surface-200 dark:border-surface-700 rounded-xl border p-6'>
            <h3 className='mb-4 flex items-center gap-2 text-lg font-bold'>
              <i className='pi pi-server' /> {dictionary.about.techStack.backend.title}
            </h3>

            <ul className='text-md text-surface-700 dark:text-surface-300 space-y-3'>
              <li>
                <strong>{dictionary.about.techStack.backend.architecture.title}</strong>
                {dictionary.about.techStack.backend.architecture.description}
              </li>

              <li>
                <strong>{dictionary.about.techStack.backend.database.title}</strong>
                {dictionary.about.techStack.backend.database.description}
              </li>

              <li>
                <strong>{dictionary.about.techStack.backend.deployment.title}</strong>
                {dictionary.about.techStack.backend.deployment.description}
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
