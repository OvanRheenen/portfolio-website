import styles from './Contact.module.scss'
import type { ContactLink } from '@/services/contact'

const isExternal = (href: string) => /^https?:\/\//i.test(href)

export default function ContactBody({ links }: { links: ContactLink[] }) {
  if (links.length === 0) return null
  return (
    <div className={styles.ledger}>
      <div className={styles.rows}>
        {links.map((l, i) => {
          const inner = (
            <>
              <span className={styles.key}>{l.medium}</span>
              <span className={styles.lead} />
              <span className={styles.val}>{l.value}</span>
            </>
          )
          return l.link ? (
            <a
              key={i}
              className={`${styles.row} ${styles.rowLink}`}
              href={l.link}
              {...(isExternal(l.link) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {inner}
            </a>
          ) : (
            <div key={i} className={styles.row}>
              {inner}
            </div>
          )
        })}
      </div>
    </div>
  )
}
