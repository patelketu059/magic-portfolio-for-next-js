import { Row, IconButton, Text, Column } from "@once-ui-system/core";
import { person, social } from "@/resources";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Column as="footer" fillWidth padding="32" paddingY="64" horizontal="center" background="neutral-strong">
      <Column maxWidth="l" fillWidth gap="32" horizontal="center">
        <Row gap="24" wrap horizontal="center">
          {social.map(
            (item) =>
              item.link && (
                <IconButton
                  key={item.name}
                  href={item.link}
                  icon={item.icon}
                  tooltip={item.name}
                  size="l"
                  variant="ghost"
                />
              ),
          )}
        </Row>
        <Text variant="body-default-s" onBackground="neutral-weak" style={{ textAlign: "center" }}>
          © {currentYear} {person.name}
        </Text>
      </Column>
    </Column>
  );
};
