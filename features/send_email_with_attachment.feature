Feature: Sending Email with Image Attachment

    As a a member of ProtonMail,
    I want to send an email with an image attachment
    so that I can exchange visual content with other people

    Scenario Outline: Send email with image URL attachment
        Given that I am a valid user logged in on my ProtonMail inbox page
        When I send an email to "<address>"
        And the URL "<imageUrl>" is inserted
        And "<subject>" is the subject
        Then the email should appear as a sent email with address "<address>", image url "<imageUrl>" and subject "<subject>"

        Examples:
            | address    | subject           | imageUrl                                                                                                                      |
            | test@a.com | Very Cute Picture | https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.ocgIzDNGdjnTr2MErP0RSAHaFj%26pid%3D15.1&f=1 |


    Scenario Outline: Send email with file image attachment
        Given that I am a valid user logged in on my ProtonMail inbox page
        When I send an email to "<address>"
        And the image "<filename>" is attached from disk
        And "<subject>" is the subject
        Then the email should appear as a sent email with address "<address>", image from disk "<filename>" and subject "<subject>"

        Examples:
            | address     | subject                   | filename               |
            | test2@a.com | Picture with Regular Logo | image_regular_logo.png |


    Scenario Outline: Send email to invalid address with file image attachment
        Given that I am a valid user logged in on my ProtonMail inbox page
        When I send an email to "<address>"
        And the image "<filename>" is attached from disk
        And "<subject>" is the subject
        Then an error message should notify me that the email "<address>" I have just entered is invalid

        Examples:
            | address | subject                 | filename               |
            | boii    | Email with Regular Word | image_regular_logo.png |
