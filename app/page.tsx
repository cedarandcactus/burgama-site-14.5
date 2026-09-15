import { ActCapabilities } from '@/components/home/act-capabilities'
import { ActClose } from '@/components/home/act-close'
import { ActOpening } from '@/components/home/act-opening'
import { ActIntroduction } from '@/components/home/act-introduction'
import { ActWork } from '@/components/home/act-work'
import { ActResults } from '@/components/home/act-results'
import { ClientTicker } from '@/components/home/client-ticker'
import styles from '@/components/home/home-page.module.css'

export default function HomePage() {
  return (
    <div className={styles.page} data-homepage>
      <ActOpening><ClientTicker /></ActOpening>
      <ActIntroduction />
      <ActCapabilities />
      <ActWork />
      <ActResults />
      <ActClose />
    </div>
  )
}
