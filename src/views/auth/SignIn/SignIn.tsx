import SignInForm from './SignInForm'

const SignIn = () => {
  return (
    <>
      <div className="text-center mb-8">
        <h3 className="mb-1">¡Bienvenido de vuelta!</h3>
        <p>Ingresa tus credenciales para iniciar sesión.</p>
      </div>
      <SignInForm disableSubmit={false} />
    </>
  )
}

export default SignIn
