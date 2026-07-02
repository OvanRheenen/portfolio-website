import Link from 'next/link'
import type { AnalyticsResult, DimensionRow, ResolvedRange } from '@/services/analytics'
import { RANGES } from '@/services/analytics'
import styles from './index.module.scss'

function Section({
  title,
  label,
  rows,
}: {
  title: string
  label: string
  rows: DimensionRow[] | null
}) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {rows === null ? (
        <p className={styles.notice}>Unavailable</p>
      ) : rows.length === 0 ? (
        <p className={styles.notice}>No data</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{label}</th>
              <th className={styles.num}>Pageviews</th>
              <th className={styles.num}>Visitors</th>
              <th className={styles.num}>Share</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key}>
                <td>{r.key}</td>
                <td className={styles.num}>{r.pageviews.toLocaleString()}</td>
                <td className={styles.num}>{r.visitors.toLocaleString()}</td>
                <td className={styles.num}>{r.share}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default function Analytics({ data, resolved }: { data: AnalyticsResult; resolved: ResolvedRange }) {
  if (data.configError) {
    return (
      <div className={styles.page}>
        <h1 className={styles.heading}>Analytics</h1>
        <div className={styles.error}>{data.configError}</div>
      </div>
    )
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Analytics</h1>
        <div className={styles.controls}>
          <nav className={styles.ranges}>
            {RANGES.map((r) => (
              <Link
                key={r}
                href={`/analytics?range=${r}`}
                prefetch={false}
                aria-current={r === resolved.active ? 'page' : undefined}
                className={`${styles.rangeBtn} ${r === resolved.active ? styles.rangeBtnActive : ''}`}
              >
                {r}
              </Link>
            ))}
          </nav>
          <form method="get" action="/analytics" className={styles.customRange}>
            <input
              type="date"
              name="since"
              defaultValue={resolved.fromDate}
              max={today}
              aria-label="From date"
              className={styles.dateInput}
            />
            <input
              type="date"
              name="until"
              defaultValue={resolved.toDate}
              max={today}
              aria-label="To date"
              className={styles.dateInput}
            />
            <button type="submit" className={styles.applyBtn}>
              Apply
            </button>
          </form>
        </div>
      </div>
      <p className={styles.range}>{resolved.label}</p>

      {data.totals && (
        <div className={styles.totals}>
          <div className={styles.total}>
            <span className={styles.totalValue}>{data.totals.pageviews.toLocaleString()}</span>
            <span className={styles.totalLabel}>Pageviews</span>
          </div>
          <div className={styles.total}>
            <span className={styles.totalValue}>{data.totals.visitors.toLocaleString()}</span>
            <span className={styles.totalLabel}>Visitors</span>
          </div>
        </div>
      )}

      <Section title="Top Pages" label="Path" rows={data.byPath} />
      <Section title="Top Routes" label="Route" rows={data.byRoute} />
      <Section title="Referrers" label="Referrer" rows={data.byReferrer} />
      <Section title="Countries" label="Country" rows={data.byCountry} />
      <Section title="Devices" label="Device" rows={data.byDevice} />
      <Section title="Browsers" label="Browser" rows={data.byBrowser} />

      {data.errors.length > 0 && (
        <div className={styles.error}>
          {data.errors.length} request(s) failed:{'\n'}
          {data.errors.join('\n')}
        </div>
      )}
    </div>
  )
}
