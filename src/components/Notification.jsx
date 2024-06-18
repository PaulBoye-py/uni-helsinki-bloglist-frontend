const Notification = ({ message, type }) => {

  if (message === null) {
    return null
  }

  const notificationClass = type === 'error' ? 'error' : 'success'
  return (
    <div>
      <h2 className={notificationClass}>{message}</h2>
    </div>
  )
}

export default Notification