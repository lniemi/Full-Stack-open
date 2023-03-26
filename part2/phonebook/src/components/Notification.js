const Notification = ({ message }) => {
if (message === null) {
    return null
}

return (
    <div className="success_message">
    {message}
    </div>
)
}

export default Notification;