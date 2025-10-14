import Container from "@/components/ui/custom/container";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DontHaveAccount from "@/components/Auth/Login/DontHaveAccount";
import LoginForm from "@/components/Auth/Login/Form";

const LoginPage = () => {
  return (
    <section className="flex-1 flex items-center">
      <Container>
        <Card className="w-full max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
          <CardFooter className="justify-center">
            <DontHaveAccount />
          </CardFooter>
        </Card>
      </Container>
    </section>
  );
};

export default LoginPage;
