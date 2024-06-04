import { HiOutlineClipboardCheck, HiOutlineHome } from 'react-icons/hi'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiOutlineHome />,
    orders: <HiOutlineClipboardCheck />,
}

export default navigationIcon
