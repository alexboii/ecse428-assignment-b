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
            | address                             | subject                            | imageUrl                                                                                                                                              |
            | alexander.bratyshkin@mail.mcgill.ca | Very Cute Picture No Format Ending | https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.ocgIzDNGdjnTr2MErP0RSAHaFj%26pid%3D15.1&f=1                         |
            | mark_zuck@fakeemail.com             | Facebook Logo Picture in .png      | https://www.facebook.com/images/fb_icon_325x325.png                                                                                                   |
            | test2@a.com                         | Elvis Presley Picture in .jpg      | https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Elvis_Presley_promoting_Jailhouse_Rock.jpg/220px-Elvis_Presley_promoting_Jailhouse_Rock.jpg |
            | samosas@b.org                       | Samosa Picture                     | https://www.clayoven.ca/wp-content/uploads/2015/04/Samosas-H.jpg                                                                                      |
            | yeltsin@sovietunionfakeemail.org    | Gif Picture                        | http://indieschoollib.com/wp-content/uploads/2015/05/Pizza.gif                                                                                        |



    Scenario Outline: Send email with file image attachment
        Given that I am a valid user logged in on my ProtonMail inbox page
        When I send an email to "<address>"
        And the image "<filename>" is attached from disk
        And "<subject>" is the subject
        Then the email should appear as a sent email with address "<address>", image from disk "<filename>" and subject "<subject>"

        Examples:
            | address                        | subject                           | filename                    |
            | ecse428@protonmail.com         | Gif Picture                       | image_animated.gif          |
            | ecse428-1@protonmail.com       | Very large picture in .jpg        | image_large.jpg             |
            | ecse428-2@protonmail.com       | Picture with Regular Logo in .png | image_regular_logo.png      |
            | test4@bla.com                  | Small Transparent Picture         | image_small_transparent.png |
            | camilo.e.garcia@mail.mcgill.ca | Image White Background            | image_white_background.jpg  |

    Scenario Outline: Send email to invalid address with file image attachment
        Given that I am a valid user logged in on my ProtonMail inbox page
        When I send an email to "<address>"
        And the image "<filename>" is attached from disk
        And "<subject>" is the subject
        Then an error message should notify me that the email "<address>" I have just entered is invalid

        Examples:
            | address        | subject                           | filename                    |
            | boii           | Regular World Email               | image_animated.gif          |
            | @              | Only [at] Email                   | image_large.jpg             |
            | .com           | Only Domain Name Email            | image_regular_logo.png      |
            | A42880sd0a     | Letters and word characters Email | image_small_transparent.png |
            | mail.mcgill.ca | Only URL Email                    | image_white_background.jpg  |