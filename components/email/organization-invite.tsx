import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface OrganizationInvitation {
  email: string;
  invitedByUsername: string;
  invitedByEmail: string;
  teamName: string;
  inviteLink: string;
}

const OrganizationInvitation = (props: OrganizationInvitation) => {
  const { email, invitedByUsername, invitedByEmail, teamName, inviteLink } =
    props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>You&apos;ve been invited to join {teamName}</Preview>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
            <Section>
              <Heading className="text-[28px] font-bold text-gray-900 mb-[24px] text-center">
                You&apos;re invited to join {teamName}
              </Heading>

              <Text className="text-[16px] text-gray-700 mb-[20px] leading-[24px]">
                Hello,
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[20px] leading-[24px]">
                <strong>{invitedByUsername}</strong> ({invitedByEmail}) has
                invited you to join <strong>{teamName}</strong> on our platform.
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[32px] leading-[24px]">
                Join your team to start collaborating, sharing resources, and
                working together more effectively. Click the button below to
                accept your invitation and get started.
              </Text>

              <Section className="text-center mb-[32px]">
                <Button
                  href={inviteLink}
                  className="bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border inline-block"
                >
                  Accept Invitation
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-[20px] leading-[20px]">
                If the button above doesn&apos;t work, you can also copy and
                paste this link into your browser:
              </Text>

              <Text className="text-[14px] text-blue-600 mb-[32px] break-all">
                <Link href={inviteLink} className="text-blue-600 underline">
                  {inviteLink}
                </Link>
              </Text>

              <Hr className="border-gray-200 my-[32px]" />

              <Text className="text-[14px] text-gray-600 mb-[8px] leading-[20px]">
                This invitation was sent to <strong>{email}</strong>. If you
                weren&apos;t expecting this invitation, you can safely ignore
                this email.
              </Text>

              <Text className="text-[12px] text-gray-500 mb-[16px] leading-[16px]">
                Need help? Contact us at support@company.com
              </Text>
            </Section>

            <Hr className="border-gray-200 my-[32px]" />

            <Section className="text-center">
              <Text className="text-[12px] text-gray-500 m-0 leading-[16px]">
                © {new Date().getFullYear()} Your Company Name. All rights
                reserved.
              </Text>
              <Text className="text-[12px] text-gray-500 m-0 leading-[16px] mt-[8px]">
                123 Business Street, Suite 100, City, State 12345
              </Text>
              <Text className="text-[12px] text-gray-500 m-0 leading-[16px] mt-[8px]">
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

export default OrganizationInvitation;
