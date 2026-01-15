import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Email } from "../hooks/useFetchMails"

const EmailCard = ({ mail }: { mail: Email }) => {
  return (
    <Card className="w-full h-auto">
        <CardHeader>
            <CardTitle className="font-semibold">{mail.from}</CardTitle>
        </CardHeader>
        <CardDescription className="px-5 font-semibold text-lg">
            <span>{mail.subject}</span>
        </CardDescription>
        <CardContent>
            <p>{mail.snippet}</p>
        </CardContent>
    </Card>
  )
}

export default EmailCard