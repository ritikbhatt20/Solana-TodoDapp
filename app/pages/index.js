import { useEffect, useState } from "react";
import dynamic from "next/dynamic"; // Import dynamic from next/dynamic
import { useTodo } from '../hooks/todo';
import Loading from '../components/Loading';
import TodoSection from '../components/todo/TodoSection';
import styles from '../styles/Home.module.css';

const DynamicWalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
  { ssr: false } // Disable SSR for WalletMultiButton
);

const Home = () => {
    const { initialized, initializeStaticUser, loading, transactionPending, completedTodos, incompleteTodos, addTodo, markTodo, removeTodo, markStaticTodo, removeStaticTodo, addStaticTodo, input, handleChange, initializeUser } = useTodo()

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // Set isClient to true when component mounts on the client-side
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.actionsContainer}>
                {initialized ? (
                    <div className={styles.todoInput}>
                        <div className={`${styles.todoCheckbox} ${styles.checked}`} />
                        <div className={styles.inputContainer}>
                            <form onSubmit={addStaticTodo}>
                                <input value={input} onChange={handleChange} id={styles.inputField} type="text" placeholder='Create a new todo...' />
                            </form>
                        </div>
                        <div className={styles.iconContainer}></div>
                    </div>
                ) : (
                    <button type="button" className={styles.button} onClick={() => initializeUser()} disabled={transactionPending}>
                        Initialize
                    </button>
                )}
                {isClient && <DynamicWalletMultiButton />} {/* Render WalletMultiButton only on the client-side */}
            </div>

            <div className={styles.mainContainer}>
                <Loading loading={loading}>
                    <TodoSection title="Tasks" todos={incompleteTodos} action={markStaticTodo} />
                    <TodoSection title="Completed" todos={completedTodos} action={removeStaticTodo} />
                </Loading>
            </div>
        </div>
    );
}

export default Home;

