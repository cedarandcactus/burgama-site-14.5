import { ActCapabilities } from '@/components/home/act-capabilities'
import { ActClose } from '@/components/home/act-close'
import { ActOpening } from '@/components/home/act-opening'
import { ActWork } from '@/components/home/act-work'
import styles from '@/components/home/home-page.module.css'

export default function HomePage() {
  return <div className={styles.page} data-homepage><ActOpening /><ActWork /><ActCapabilities /><ActClose /></div>
}
