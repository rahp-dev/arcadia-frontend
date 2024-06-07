import {
    HiOutlineClipboardCheck,
    HiOutlineHome,
    HiOutlineUserAdd,
} from 'react-icons/hi'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiOutlineHome />,
    orders: <HiOutlineClipboardCheck />,
    assingments: <HiOutlineUserAdd />,
}

export default navigationIcon
