import PrimaryButton from "../button/PrimaryButton";
import Styles from "./dashboard.module.css";

type RegisterUserProps = {
  userName: string;
  userNameError: boolean;
  handleUserNameChange: (name: string) => void;
  handleJoinDashboard: () => void;
};

function RegisterUser({
  userName,
  handleUserNameChange,
  handleJoinDashboard,
  userNameError,
}: RegisterUserProps) {
  return (
    <main className={Styles.main_container}>
      <div className={Styles.register_user_wrapper}>
        <div className={Styles.register_user_container}>
          <h1>Choose a username</h1>
          <input
            type='text'
            placeholder='Type your username here...'
            value={userName}
            onChange={(e) => handleUserNameChange(e.target.value)}
          />
          {userNameError && <p>Username must be at least 4 characters long</p>}
          <PrimaryButton
            buttonText='Enter lobby'
            clickHandler={handleJoinDashboard}
          />
        </div>
      </div>
    </main>
  );
}

export default RegisterUser;
