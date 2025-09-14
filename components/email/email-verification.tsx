import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface VerificationProps {
  userName: string;
  verificationUrl: string;
}
const EmailVerification = (props: VerificationProps) => {
  const { userName, verificationUrl } = props;

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>
        Verify your email address to complete your account setup
      </Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
            <Section className="text-center mb-[32px]">
              <Heading className="text-[28px] font-bold text-gray-900 m-0 mb-[16px]">
                Verify Your Email Address
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                We need to verify your email address to complete your account
                setup
              </Text>
            </Section>

            <Section className="mb-[32px]">
              <Text className="text-[16px] text-gray-700 mb-[16px] m-0">
                Hi there,
              </Text>
              <Text className="text-[16px] text-gray-700 mb-[16px] m-0">
                Thanks {userName} for signing up! To get started, please verify
                your email address by clicking the button below:
              </Text>

              <Section className="text-center mb-[24px]">
                <Button
                  href={verificationUrl}
                  className="bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border inline-block"
                >
                  Verify Email Address
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-[16px] m-0">
                If the button does&apos;t work, you can copy and paste this link
                into your browser:
              </Text>
              <Text className="text-[14px] text-blue-600 break-all mb-[24px] m-0">
                <Link
                  href={verificationUrl}
                  className="text-blue-600 underline"
                >
                  Link
                </Link>
              </Text>

              <Text className="text-[14px] text-gray-600 mb-[16px] m-0">
                This verification link will expire in 5 minutes for security
                reasons.
              </Text>

              <Text className="text-[16px] text-gray-700 m-0">
                If you didn&apos;t create an account, you can safely ignore this
                email.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-solid border-gray-200 pt-[24px] mt-[32px]">
              <Text className="text-[12px] text-gray-500 text-center m-0 mb-[8px]">
                © 2024 Your Company Name. All rights reserved.
              </Text>
              <Text className="text-[12px] text-gray-500 text-center m-0 mb-[8px]">
                123 Business Street, Ho Chi Minh City, Vietnam
              </Text>
              <Text className="text-[12px] text-gray-500 text-center m-0">
                <Link href="#" className="text-gray-500 underline">
                  Unsubscribe
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
export default EmailVerification;
