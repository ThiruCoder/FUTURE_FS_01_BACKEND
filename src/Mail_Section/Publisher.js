import { sendUserRequest } from "../../utils/Mailer.js";


const sendMail = async (req, res) => {
    const { email, message, name } = req.body;

    try {
        if (!email.trim() || !message.trim() || !name.trim()) {
            return res.status(404).json({
                success: false,
                message: 'Name, Email and Message are required.'
            })
        }
        // const ss = await sendUserRequest()
        const sendMail = await sendUserRequest(
            email,
            `New message from ${name}`,
            message,
            `
            <div>
                <h2>New Message Form DevSite</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>From:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                    <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
            `
        )
        if (!sendMail) {
            return res.status.json({
                success: false,
                message: 'No send message',
            })
        }
        return res.status(200).json({
            success: true,
            message: 'Successfully message sended.'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Somethink wenk wrong.'
        })
    }
}

export { sendMail }