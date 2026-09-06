import { ActCapabilities } from '@/components/home/act-capabilities'
import { ActClose } from '@/components/home/act-close'
import { ActOpening } from '@/components/home/act-opening'
import { ActWork } from '@/components/home/act-work'
import { SmoothScroll } from '@/components/smooth-scroll'

export default function HomePage() {
  return <><SmoothScroll /><ActOpening /><ActWork /><ActCapabilities /><ActClose /></>
}
