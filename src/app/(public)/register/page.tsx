import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Container from "@/components/ui/custom/container";
import AlreadyHaveAccount from "@/components/Auth/Registration/AlreadyHaveAccount";
import RegisterForm from "@/components/Auth/Registration/Form";

const RegisterPage = () => {
  return (
    <section className="flex-1 flex items-center">
      <Container>
        <Card className="w-full max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle>Register</CardTitle>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
          <CardFooter className="justify-center">
            <AlreadyHaveAccount />
          </CardFooter>
        </Card>
      </Container>
    </section>
  );
};

export default RegisterPage;
