import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHomeAlt, faAngleRight } from '@fortawesome/free-solid-svg-icons'

export default function Breadcrumbs(props) {
    return (
        <div className='flex  flex-row items-center space-x-2 sm:space-x-4 text-white dark:text-gray-800 text-center'>
            <h1 className='flex-none text-xl sm:text-2xl font-bold capitalize'>{props.home}</h1>
            <div className='border-r-2 border-[#787984]'>&nbsp;</div>
            <div className='flex-none text-md sm:text-base'>
                <FontAwesomeIcon icon={faHomeAlt}></FontAwesomeIcon>
            </div>
            {props.breadcrumbs.map((item, index) => (
                <div key={"breadcrumb" + index.toString()} className="flex-none flex flex-row space-x-2 sm:space-x-4 items-center">
                    <div>
                        <FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>
                        <FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>
                    </div>
                    <p className='capitalize'>{item}</p>
                </div>
            ))}
        </div>
    )
}