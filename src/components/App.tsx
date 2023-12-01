import styles from './App.module.scss'
import { TestPage } from '@/components/testPage/TestPage'
import image from '@/assets/mountain.jpg'
import Done from '@/assets/done.svg'

export const App = () => {
    return(
        <>
        <TestPage/>
        <p className={styles.button}>App page </p>
        <img src={image}></img>
        <Done width={200} height={200}/>
        </>
    )
}