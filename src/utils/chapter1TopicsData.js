/**
 * Chapter 1: Computer Networks (9th Class Computer Science)
 * Topics 1.7 to 1.16 with full MCQs (including teacher answer keys) and Short Questions
 */

export const CHAPTER_1_NEW_TOPICS = [
  // =========================================================================
  // TOPIC 1.7: NETWORK PROTOCOLS AND SERVICES
  // =========================================================================
  {
    id: "cs-ch1-topic-1.7",
    topicNumber: "1.7",
    name: "Network Protocols and Services",
    mcqs: [
      {
        id: "ch1-t1.7-m1",
        question: "What is a network protocol?",
        options: [
          "A physical safety lock for network server racks",
          "A set of rules that controls how data is formatted and transmitted",
          "A program used exclusively to design website graphics",
          "A high-power wireless antenna booster"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "A set of rules that controls how data is formatted and transmitted",
        marks: 1
      },
      {
        id: "ch1-t1.7-m2",
        question: "Which protocol suite is the main standard language used on the Internet for addressing, routing, and reliable delivery?",
        options: [
          "HTTP / HTTPS",
          "FTP / SFTP",
          "TCP / IP",
          "DNS / DHCP"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "TCP / IP",
        marks: 1
      },
      {
        id: "ch1-t1.7-m3",
        question: "Which component of the TCP/IP suite is specifically responsible for ensuring the reliable delivery of data?",
        options: [
          "Internet Protocol (IP)",
          "Hypertext Transfer Protocol (HTTP)",
          "Transmission Control Protocol (TCP)",
          "File Transfer Protocol (FTP)"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "Transmission Control Protocol (TCP)",
        marks: 1
      },
      {
        id: "ch1-t1.7-m4",
        question: "What is the primary purpose of the Hypertext Transfer Protocol (HTTP)?",
        options: [
          "To upload large files to a remote backup drive",
          "To transfer web pages between a web browser and a web server",
          "To translate domain names into physical addresses",
          "To assign dynamic IP addresses to home devices"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "To transfer web pages between a web browser and a web server",
        marks: 1
      },
      {
        id: "ch1-t1.7-m5",
        question: "Why is HTTPS preferred over HTTP for sensitive online transactions?",
        options: [
          "It is much faster and uses less CPU power",
          "It does not require any active internet connection",
          "It uses SSL/TLS protocols to encrypt data during transmission",
          "It connects devices directly without using a web server"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "It uses SSL/TLS protocols to encrypt data during transmission",
        marks: 1
      },
      {
        id: "ch1-t1.7-m6",
        question: "What protocols are used to provide the encryption in HTTPS?",
        options: [
          "TCP/IP",
          "SSL/TLS",
          "FTP/SFTP",
          "DNS/DNSSEC"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "SSL/TLS",
        marks: 1
      },
      {
        id: "ch1-t1.7-m7",
        question: "Which protocol is commonly used by web developers to upload and download files between computers?",
        options: [
          "HTTP",
          "IP",
          "FTP",
          "DNS"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "FTP",
        marks: 1
      },
      {
        id: "ch1-t1.7-m8",
        question: "Which system acts behind the scenes to convert human-readable website names into numeric IP addresses?",
        options: [
          "FTP",
          "DNS",
          "TCP",
          "HTTP"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "DNS",
        marks: 1
      },
      {
        id: "ch1-t1.7-m9",
        question: "Who performs the translation process of converting website domain names to IP addresses?",
        options: [
          "Web browsers locally on the hard drive",
          "DNS servers",
          "Network Interface Cards",
          "Physical gateway switches"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "DNS servers",
        marks: 1
      },
      {
        id: "ch1-t1.7-m10",
        question: "According to the textbook \"Tidbit\" on Page 9, when does DNS work?",
        options: [
          "Only when the computer is restarting",
          "Behind the scenes every time a website is opened",
          "Only during large file uploads",
          "When a physical Ethernet cable is unplugged"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Behind the scenes every time a website is opened",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch1-t1.7-s1",
        question: "Define a network protocol and give two common examples.",
        marks: 2
      },
      {
        id: "ch1-t1.7-s2",
        question: "Explain the individual roles of TCP and IP when they work together as a suite.",
        marks: 2
      },
      {
        id: "ch1-t1.7-s3",
        question: "Differentiate between HTTP and HTTPS. Why is HTTPS essential for e-commerce websites?",
        marks: 2
      },
      {
        id: "ch1-t1.7-s4",
        question: "What is File Transfer Protocol (FTP), and who commonly uses it?",
        marks: 2
      },
      {
        id: "ch1-t1.7-s5",
        question: "Why do we need the Domain Name System (DNS)? What would happen if DNS did not exist?",
        marks: 2
      }
    ],
    longQuestions: []
  },

  // =========================================================================
  // TOPIC 1.8: IP ADDRESSING AND SUBNETTING
  // =========================================================================
  {
    id: "cs-ch1-topic-1.8",
    topicNumber: "1.8",
    name: "IP Addressing and Subnetting",
    mcqs: [
      {
        id: "ch1-t1.8-m1",
        question: "What is an IP address?",
        options: [
          "A physical serial number stamped on the computer chassis",
          "A unique number assigned to a device to identify it on a network",
          "A software license code required to run web browsers",
          "An email address used for administrative recovery"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "A unique number assigned to a device to identify it on a network",
        marks: 1
      },
      {
        id: "ch1-t1.8-m2",
        question: "How many bits are used to represent a standard IPv4 address?",
        options: [
          "16 bits",
          "32 bits",
          "64 bits",
          "128 bits"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "32 bits",
        marks: 1
      },
      {
        id: "ch1-t1.8-m3",
        question: "An IPv4 address is divided into how many numeric parts separated by dots, and what is the value range of each part?",
        options: [
          "2 parts; ranging from 0 to 100",
          "4 parts; ranging from 0 to 255",
          "8 parts; ranging from 0 to 512",
          "6 parts; ranging from 0 to 999"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "4 parts; ranging from 0 to 255",
        marks: 1
      },
      {
        id: "ch1-t1.8-m4",
        question: "In the IPv4 address breakdown, which part identifies the local network?",
        options: [
          "Host part",
          "Global routing prefix",
          "Network part",
          "Interface ID"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "Network part",
        marks: 1
      },
      {
        id: "ch1-t1.8-m5",
        question: "According to the \"Do you know?\" box on Page 10, what is the total number of possible IPv4 addresses?",
        options: [
          "1.25 billion",
          "2.56 billion",
          "4.29 billion",
          "10.5 billion"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "4.29 billion",
        marks: 1
      },
      {
        id: "ch1-t1.8-m6",
        question: "How many bits are used in a newer IPv6 address?",
        options: [
          "32 bits",
          "64 bits",
          "128 bits",
          "256 bits"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "128 bits",
        marks: 1
      },
      {
        id: "ch1-t1.8-m7",
        question: "An IPv6 address is represented as:",
        options: [
          "4 decimal numbers separated by dots",
          "6 octal numbers separated by slashes",
          "8 groups of 4 hexadecimal digits separated by colons",
          "16 groups of binary numbers separated by hyphens"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "8 groups of 4 hexadecimal digits separated by colons",
        marks: 1
      },
      {
        id: "ch1-t1.8-m8",
        question: "Which of the following is one of the three components in the breakdown of an IPv6 address?",
        options: [
          "Subnet Mask",
          "Global routing prefix",
          "Local gateway ID",
          "MAC address identifier"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Global routing prefix",
        marks: 1
      },
      {
        id: "ch1-t1.8-m9",
        question: "What is subnetting?",
        options: [
          "Connecting a home network to an external satellite",
          "Dividing a network into smaller parts to reduce traffic and improve performance",
          "Translating domain names into MAC addresses",
          "Encrypting local database tables"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Dividing a network into smaller parts to reduce traffic and improve performance",
        marks: 1
      },
      {
        id: "ch1-t1.8-m10",
        question: "Which technology allows many devices on a private local network to share a single public IP address?",
        options: [
          "Domain Name System (DNS)",
          "Network Address Translation (NAT)",
          "Dynamic Host Configuration Protocol (DHCP)",
          "Subnetting"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Network Address Translation (NAT)",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch1-t1.8-s1",
        question: "Explain the difference between IPv4 and IPv6 in terms of address size and representation format.",
        marks: 2
      },
      {
        id: "ch1-t1.8-s2",
        question: "Describe the two functional parts of an IPv4 address using the street/house analogy from the textbook.",
        marks: 2
      },
      {
        id: "ch1-t1.8-s3",
        question: "List the three parts of an IPv6 address and state what each part means.",
        marks: 2
      },
      {
        id: "ch1-t1.8-s4",
        question: "What is subnetting, and what are its three main benefits?",
        marks: 2
      },
      {
        id: "ch1-t1.8-s5",
        question: "Why is Network Address Translation (NAT) used in home routers? How does it improve security?",
        marks: 2
      }
    ],
    longQuestions: []
  },

  // =========================================================================
  // TOPIC 1.9: HOME NETWORK SETUP AND CONFIGURATION
  // =========================================================================
  {
    id: "cs-ch1-topic-1.9",
    topicNumber: "1.9",
    name: "Home Network Setup and Configuration",
    mcqs: [
      {
        id: "ch1-t1.9-m1",
        question: "What is the primary purpose of a home network?",
        options: [
          "To manufacture hardware components in a house",
          "To connect different devices in a house so they can communicate and share an internet connection",
          "To bypass the subscription fees of Internet Service Providers",
          "To format the operating systems of connected laptops"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "To connect different devices in a house so they can communicate and share an internet connection",
        marks: 1
      },
      {
        id: "ch1-t1.9-m2",
        question: "Which device acts as the main central device in a home network?",
        options: [
          "Network Interface Card (NIC)",
          "Router",
          "Modem",
          "Network Switch"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Router",
        marks: 1
      },
      {
        id: "ch1-t1.9-m3",
        question: "Which component connects the home network to the Internet Service Provider (ISP)?",
        options: [
          "Access Point",
          "Network Cable",
          "Modem",
          "Switch"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "Modem",
        marks: 1
      },
      {
        id: "ch1-t1.9-m4",
        question: "What type of physical cables are commonly used to establish wired connections in home networks?",
        options: [
          "Coaxial TV cables",
          "Fiber-optic patch cords only",
          "Ethernet cables",
          "Telephone copper wire lines only"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "Ethernet cables",
        marks: 1
      },
      {
        id: "ch1-t1.9-m5",
        question: "How are devices connected in a wired home network?",
        options: [
          "Directly to the computer's sound card",
          "Directly to a router or switch using cables",
          "Through high-frequency radio waves only",
          "Via an external satellite receiver"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Directly to a router or switch using cables",
        marks: 1
      },
      {
        id: "ch1-t1.9-m6",
        question: "What is a major performance benefit of a wired network connection?",
        options: [
          "It allows devices to move around freely",
          "It provides high speed and stable performance",
          "It does not require any physical hardware devices",
          "It automatically extends the wireless Wi-Fi range"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "It provides high speed and stable performance",
        marks: 1
      },
      {
        id: "ch1-t1.9-m7",
        question: "What is a disadvantage of a wired network connection?",
        options: [
          "It is highly vulnerable to wireless radio interference",
          "Devices cannot move freely because of cables",
          "It has much slower transmission speeds than wireless connections",
          "It requires a continuous internet connection to work locally"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Devices cannot move freely because of cables",
        marks: 1
      },
      {
        id: "ch1-t1.9-m8",
        question: "A wireless network connects devices without cables by using:",
        options: [
          "Infrared light beams",
          "Radio signals",
          "Sound vibrations",
          "Laser pulses"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Radio signals",
        marks: 1
      },
      {
        id: "ch1-t1.9-m9",
        question: "What is the most common wireless technology used in homes today?",
        options: [
          "Bluetooth",
          "Wi-Fi",
          "Infrared",
          "Cellular 3G"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Wi-Fi",
        marks: 1
      },
      {
        id: "ch1-t1.9-m10",
        question: "What is a key advantage of wireless network connections over wired ones?",
        options: [
          "They are always faster than wired connections",
          "Devices can move freely within the network range",
          "They do not require any configuration",
          "They are completely immune to hacking"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Devices can move freely within the network range",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch1-t1.9-s1",
        question: "What is a home network, and which device is its central component?",
        marks: 2
      },
      {
        id: "ch1-t1.9-s2",
        question: "List any four key components needed to set up a complete home network.",
        marks: 2
      },
      {
        id: "ch1-t1.9-s3",
        question: "Compare wired and wireless connections in a home network based on speed, mobility, and security.",
        marks: 2
      },
      {
        id: "ch1-t1.9-s4",
        question: "Why are wired networks considered more secure than wireless networks?",
        marks: 2
      },
      {
        id: "ch1-t1.9-s5",
        question: "Name the main physical cable type used in wired local networks, and state its limitation.",
        marks: 2
      }
    ],
    longQuestions: []
  },

  // =========================================================================
  // TOPIC 1.10: WI-FI SECURITY AND ROUTER CONFIGURATION
  // =========================================================================
  {
    id: "cs-ch1-topic-1.10",
    topicNumber: "1.10",
    name: "Wi-Fi Security and Router Configuration",
    mcqs: [
      {
        id: "ch1-t1.10-m1",
        question: "What is the primary purpose of Wi-Fi security?",
        options: [
          "To increase the subscription bandwidth speed",
          "To protect the network from unauthorized access and prevent data theft",
          "To allow visitors to download large files faster",
          "To clean the temporary cache files of the router"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "To protect the network from unauthorized access and prevent data theft",
        marks: 1
      },
      {
        id: "ch1-t1.10-m2",
        question: "How is the router web interface accessed to change configuration settings?",
        options: [
          "By typing the router's IP address into a web browser",
          "By double-clicking the physical reset button on the router",
          "By writing code in the command prompt terminal using ping",
          "By installing an operating system updates disc"
        ],
        answer: "(a)",
        correctIndex: 0,
        answerKey: "By typing the router's IP address into a web browser",
        marks: 1
      },
      {
        id: "ch1-t1.10-m3",
        question: "What credentials are required to log into the router configuration web interface?",
        options: [
          "The ISP server domain name and email address",
          "A username and password",
          "The MAC address of the laptop and computer",
          "A subscription activation key"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "A username and password",
        marks: 1
      },
      {
        id: "ch1-t1.10-m4",
        question: "What is Wi-Fi encryption?",
        options: [
          "A process that speeds up physical file copies",
          "Converting data into a secure form during transmission to prevent data theft",
          "Blocking incoming calls on a mobile phone",
          "Storing backup files in hard drives"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Converting data into a secure form during transmission to prevent data theft",
        marks: 1
      },
      {
        id: "ch1-t1.10-m5",
        question: "Which of the following are common, secure encryption protocols used in Wi-Fi networks?",
        options: [
          "WEP and older protocols",
          "WPA2 and WPA3",
          "FTP and HTTP",
          "SSL and TLS only"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "WPA2 and WPA3",
        marks: 1
      },
      {
        id: "ch1-t1.10-m6",
        question: "Why is the older WEP encryption protocol not recommended for Wi-Fi security today?",
        options: [
          "It is too fast for modern routers",
          "It is not secure",
          "It does not support passwords",
          "It only works with wired connections"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "It is not secure",
        marks: 1
      },
      {
        id: "ch1-t1.10-m7",
        question: "What is a \"Default Gateway\" in a network setup?",
        options: [
          "A security door in the computer server room",
          "The IP address of the router that connects a local network to other networks",
          "A software tool used to clean malware",
          "The main website address of the ISP"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "The IP address of the router that connects a local network to other networks",
        marks: 1
      },
      {
        id: "ch1-t1.10-m8",
        question: "What happens to local network data that is meant for an outside/external network?",
        options: [
          "It is automatically deleted by the switch",
          "It goes through the default gateway to be forwarded to its destination",
          "It is stored on a local backup drive",
          "It is broadcast to all local devices simultaneously"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "It goes through the default gateway to be forwarded to its destination",
        marks: 1
      },
      {
        id: "ch1-t1.10-m9",
        question: "What is a \"Guest Network\"?",
        options: [
          "A high-speed network reserved for gaming",
          "A separate wireless network that allows visitors to use the internet without accessing personal devices",
          "A wired network segment used to test hardware faults",
          "An internal ISP server used for website hosting"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "A separate wireless network that allows visitors to use the internet without accessing personal devices",
        marks: 1
      },
      {
        id: "ch1-t1.10-m10",
        question: "How does a Guest Network improve local security?",
        options: [
          "It disables the main firewall of the home router",
          "It prevents visitor users from accessing or viewing your personal devices on the main network",
          "It encrypts the ISP's main servers",
          "It restricts internet browsing speed to zero"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "It prevents visitor users from accessing or viewing your personal devices on the main network",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch1-t1.10-s1",
        question: "State the steps required to access and log into a router's configuration settings.",
        marks: 2
      },
      {
        id: "ch1-t1.10-s2",
        question: "Why should network administrators avoid using the WEP encryption protocol? Which protocols should they use instead?",
        marks: 2
      },
      {
        id: "ch1-t1.10-s3",
        question: "Define the term Default Gateway and explain its role when you search for a website on the internet.",
        marks: 2
      },
      {
        id: "ch1-t1.10-s4",
        question: "What is a Guest Network, and what is its primary security advantage?",
        marks: 2
      },
      {
        id: "ch1-t1.10-s5",
        question: "Give three examples of settings that a user can change or control using a router's web interface.",
        marks: 2
      }
    ],
    longQuestions: []
  },

  // =========================================================================
  // TOPIC 1.11: NETWORK DIAGNOSTIC TOOLS AND COMMANDS
  // =========================================================================
  {
    id: "cs-ch1-topic-1.11",
    topicNumber: "1.11",
    name: "Network Diagnostic Tools and Commands",
    mcqs: [
      {
        id: "ch1-t1.11-m1",
        question: "What is the primary purpose of network diagnostic tools?",
        options: [
          "To design new visual layouts for web pages",
          "To find and troubleshoot network connection problems",
          "To increase the physical processing power of computers",
          "To permanently format local storage drives"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "To find and troubleshoot network connection problems",
        marks: 1
      },
      {
        id: "ch1-t1.11-m2",
        question: "How are diagnostic commands executed on a computer system?",
        options: [
          "By double-clicking the router's desktop icon",
          "By entering them using the command prompt or terminal",
          "By writing them in a basic text document",
          "By launching the system's web browser settings"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "By entering them using the command prompt or terminal",
        marks: 1
      },
      {
        id: "ch1-t1.11-m3",
        question: "Which command is used to test network connectivity and measure response times to a remote host?",
        options: [
          "ipconfig",
          "ifconfig",
          "ping",
          "telnet"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "ping",
        marks: 1
      },
      {
        id: "ch1-t1.11-m4",
        question: "What does the ping command send to the destination device to test connection?",
        options: [
          "Large compressed text documents",
          "Small data packets",
          "Encrypted virus scan scripts",
          "Remote login session requests"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Small data packets",
        marks: 1
      },
      {
        id: "ch1-t1.11-m5",
        question: "Which of the following is a sample ping command shown on Page 13 of the textbook?",
        options: [
          "ping google.com",
          "ping search.net",
          "ping webserver.org",
          "ping myrouter.lan"
        ],
        answer: "(a)",
        correctIndex: 0,
        answerKey: "ping google.com",
        marks: 1
      },
      {
        id: "ch1-t1.11-m6",
        question: "Which command-line tool is used in Windows operating system to display IP address, subnet mask, and default gateway settings?",
        options: [
          "ifconfig",
          "ipconfig",
          "ping",
          "ssh"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "ipconfig",
        marks: 1
      },
      {
        id: "ch1-t1.11-m7",
        question: "Which command-line tool displays network settings in Linux and macOS systems?",
        options: [
          "ipconfig",
          "ifconfig",
          "ping",
          "telnet"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "ifconfig",
        marks: 1
      },
      {
        id: "ch1-t1.11-m8",
        question: "Why is using Telnet considered highly insecure for remote device access?",
        options: [
          "It is extremely slow over wireless networks",
          "It sends data (including passwords) in plain text without any encryption",
          "It can only connect to a local web server",
          "It requires a physical CD-ROM to run"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "It sends data (including passwords) in plain text without any encryption",
        marks: 1
      },
      {
        id: "ch1-t1.11-m9",
        question: "What is PuTTY?",
        options: [
          "A type of physical copper cabling",
          "A popular software tool used for remote login",
          "A command used to display subnet masks",
          "A security firewall device"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "A popular software tool used for remote login",
        marks: 1
      },
      {
        id: "ch1-t1.11-m10",
        question: "Why is SSH (Secure Shell) preferred over Telnet for remote administration?",
        options: [
          "It is completely free and requires no configuration",
          "It encrypts transmitted data for safety",
          "It does not require a destination IP address",
          "It is a hardware-based device"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "It encrypts transmitted data for safety",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch1-t1.11-s1",
        question: "What is the purpose of the ping command? Explain how it uses packets to measure response time.",
        marks: 2
      },
      {
        id: "ch1-t1.11-s2",
        question: "Differentiate between the ipconfig and ifconfig commands. Which operating system does each belong to?",
        marks: 2
      },
      {
        id: "ch1-t1.11-s3",
        question: "Why is Telnet considered an unsafe protocol for logging into a remote router?",
        marks: 2
      },
      {
        id: "ch1-t1.11-s4",
        question: "What is SSH, and why is it preferred over Telnet for managing network devices?",
        marks: 2
      },
      {
        id: "ch1-t1.11-s5",
        question: "Define network troubleshooting and list three aspects of a network that troubleshooting checks.",
        marks: 2
      }
    ],
    longQuestions: []
  },

  // =========================================================================
  // TOPIC 1.12: NETWORK PERFORMANCE
  // =========================================================================
  {
    id: "cs-ch1-topic-1.12",
    topicNumber: "1.12",
    name: "Network Performance",
    mcqs: [
      {
        id: "ch1-t1.12-m1",
        question: "What does network performance refer to?",
        options: [
          "The cost of installing network cables",
          "How easy the configuration interface is to use",
          "How well a network works, showing the speed and quality of data transfer",
          "The total number of devices connected to a router"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "How well a network works, showing the speed and quality of data transfer",
        marks: 1
      },
      {
        id: "ch1-t1.12-m2",
        question: "What is network bandwidth?",
        options: [
          "The delay between sending and receiving data packets",
          "The amount of data a network can carry/send in a given time",
          "The physical distance between two network switches",
          "The number of local servers running on the system"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "The amount of data a network can carry/send in a given time",
        marks: 1
      },
      {
        id: "ch1-t1.12-m3",
        question: "In what unit is network bandwidth typically measured?",
        options: [
          "Milliseconds (ms)",
          "Megabits per second (Mbps)",
          "Megabytes per minute (MB/min)",
          "Gigahertz (GHz)"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Megabits per second (Mbps)",
        marks: 1
      },
      {
        id: "ch1-t1.12-m4",
        question: "What is the impact of having too many devices using a low-bandwidth connection?",
        options: [
          "Devices will disconnect from the network permanently",
          "It can cause slow internet speeds",
          "The network latency drops to zero",
          "It damages the physical router cables"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "It can cause slow internet speeds",
        marks: 1
      },
      {
        id: "ch1-t1.12-m5",
        question: "Network latency is best defined as:",
        options: [
          "The maximum data carrying capacity of a network cable",
          "The time taken by data to travel between a sender and a receiver",
          "The number of active data streams on a switch",
          "The frequency of wireless Wi-Fi signals"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "The time taken by data to travel between a sender and a receiver",
        marks: 1
      },
      {
        id: "ch1-t1.12-m6",
        question: "What unit of measurement is used to measure network latency?",
        options: [
          "Megabits per second (Mbps)",
          "Bytes",
          "Milliseconds (ms)",
          "Kilohertz (kHz)"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "Milliseconds (ms)",
        marks: 1
      },
      {
        id: "ch1-t1.12-m7",
        question: "Which of the following applications strictly require low network latency to function properly?",
        options: [
          "Offline word processing",
          "Online games and video calls",
          "Sending standard text emails",
          "Downloading static images"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Online games and video calls",
        marks: 1
      },
      {
        id: "ch1-t1.12-m8",
        question: "What happens to a system's response rate when network latency is low?",
        options: [
          "Response rate becomes slower",
          "Low latency means faster response",
          "The response rate drops to zero",
          "Data packets stop traveling"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Low latency means faster response",
        marks: 1
      },
      {
        id: "ch1-t1.12-m9",
        question: "Which of the following is a main cause of network delay listed in the textbook?",
        options: [
          "Using secure WPA3 passwords",
          "Upgrading to IPv6 addressing",
          "Poor-quality cables and long distances between devices",
          "Reducing the number of active users"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "Poor-quality cables and long distances between devices",
        marks: 1
      },
      {
        id: "ch1-t1.12-m10",
        question: "How does network congestion affect data speed?",
        options: [
          "It causes the speed to increase dramatically",
          "It negatively affects data speed, causing delays",
          "It converts digital signals to analog",
          "It reduces the physical distance between hosts"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "It negatively affects data speed, causing delays",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch1-t1.12-s1",
        question: "Define network performance and list the two major performance metrics described on Page 14.",
        marks: 2
      },
      {
        id: "ch1-t1.12-s2",
        question: "What is network bandwidth, and in what unit is it measured? How does it differ from latency?",
        marks: 2
      },
      {
        id: "ch1-t1.12-s3",
        question: "Explain the term network latency and state why online gaming and video calls require low latency.",
        marks: 2
      },
      {
        id: "ch1-t1.12-s4",
        question: "List any four causes of network delay mentioned in the textbook.",
        marks: 2
      },
      {
        id: "ch1-t1.12-s5",
        question: "How can poor-quality cables and long physical distances affect overall network performance?",
        marks: 2
      }
    ],
    longQuestions: []
  },

  // =========================================================================
  // TOPIC 1.13: NETWORK LOAD BALANCING
  // =========================================================================
  {
    id: "cs-ch1-topic-1.13",
    topicNumber: "1.13",
    name: "Network Load Balancing",
    mcqs: [
      {
        id: "ch1-t1.13-m1",
        question: "What is network load balancing?",
        options: [
          "A physical technique used to weigh network server racks",
          "Managing network traffic by distributing work among multiple servers or links",
          "A method used to encrypt data on hard drives",
          "The process of dividing a local network into smaller subnets"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Managing network traffic by distributing work among multiple servers or links",
        marks: 1
      },
      {
        id: "ch1-t1.13-m2",
        question: "What is the primary purpose of distributing network traffic across multiple servers?",
        options: [
          "To save physical electricity inside the data center",
          "To prevent overloading of any single device",
          "To eliminate the need for routers and switches",
          "To automatically translate domain names to IP addresses"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "To prevent overloading of any single device",
        marks: 1
      },
      {
        id: "ch1-t1.13-m3",
        question: "Where is network load balancing commonly used?",
        options: [
          "Only in standalone home computers",
          "In large networks and data centers",
          "In physical copper cabling factories",
          "In offline diagnostic applications"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "In large networks and data centers",
        marks: 1
      },
      {
        id: "ch1-t1.13-m4",
        question: "How does load balancing improve network speed and response time?",
        options: [
          "By increasing the subscriber bandwidth for free",
          "By sending all traffic to a single main server",
          "By distributing the network traffic evenly so no single server is overloaded",
          "By disabling the network's security firewalls"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "By distributing the network traffic evenly so no single server is overloaded",
        marks: 1
      },
      {
        id: "ch1-t1.13-m5",
        question: "How does load balancing reduce the risk of complete server failure?",
        options: [
          "It physically cools down the server hardware",
          "If one server fails, other active servers continue working to handle traffic",
          "It makes copies of files on local backup hard drives",
          "It deletes corrupted files automatically"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "If one server fails, other active servers continue working to handle traffic",
        marks: 1
      },
      {
        id: "ch1-t1.13-m6",
        question: "Which of the following is a benefit of implementing network load balancing?",
        options: [
          "It increases physical cable thickness",
          "It provides a better user experience and increases network availability",
          "It translates private IP addresses to public ones",
          "It runs offline without any electricity"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "It provides a better user experience and increases network availability",
        marks: 1
      },
      {
        id: "ch1-t1.13-m7",
        question: "What are the three basic load balancing methods listed in the textbook?",
        options: [
          "Subnetting, NAT, and Routing",
          "Round Robin, Least Connection, and IP Hash",
          "Ping, Ipconfig, and Traceroute",
          "WEP, WPA2, and WPA3"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Round Robin, Least Connection, and IP Hash",
        marks: 1
      },
      {
        id: "ch1-t1.13-m8",
        question: "How does the Round Robin load-balancing method distribute incoming requests?",
        options: [
          "It sends requests to the server with the lowest active connections",
          "It sends requests one by one sequentially to each server in a rotating loop",
          "It uses the client's IP address to map requests to a specific server",
          "It randomly drops half of the incoming requests"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "It sends requests one by one sequentially to each server in a rotating loop",
        marks: 1
      },
      {
        id: "ch1-t1.13-m9",
        question: "Which load-balancing method directs incoming network traffic to the server that is currently less busy?",
        options: [
          "Round Robin method",
          "Least Connection method",
          "IP Hash method",
          "Direct Routing method"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Least Connection method",
        marks: 1
      },
      {
        id: "ch1-t1.13-m10",
        question: "What does the IP Hash load-balancing method use to decide which server handles client traffic?",
        options: [
          "The physical MAC address of the switch",
          "The client's IP address",
          "The response time of the ping command",
          "The total file size of the request"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "The client's IP address",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch1-t1.13-s1",
        question: "Define network load balancing and state where it is typically used.",
        marks: 2
      },
      {
        id: "ch1-t1.13-s2",
        question: "Explain three major benefits of implementing load balancing in a website's server architecture.",
        marks: 2
      },
      {
        id: "ch1-t1.13-s3",
        question: "Describe how the Round Robin load-balancing method works.",
        marks: 2
      },
      {
        id: "ch1-t1.13-s4",
        question: "Compare the Least Connection method with the IP Hash method of load balancing.",
        marks: 2
      },
      {
        id: "ch1-t1.13-s5",
        question: "Why is load balancing essential for maintaining a high-availability network during traffic spikes?",
        marks: 2
      }
    ],
    longQuestions: []
  },

  // =========================================================================
  // TOPIC 1.14: NETWORK SECURITY
  // =========================================================================
  {
    id: "cs-ch1-topic-1.14",
    topicNumber: "1.14",
    name: "Network Security",
    mcqs: [
      {
        id: "ch1-t1.14-m1",
        question: "What is the primary role of network security?",
        options: [
          "To increase data transfer speeds",
          "To protect computer networks and keep data safe from unauthorized access, loss, or damage",
          "To connect local printers directly to the internet",
          "To organize database tables into rows and columns"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "To protect computer networks and keep data safe from unauthorized access, loss, or damage",
        marks: 1
      },
      {
        id: "ch1-t1.14-m2",
        question: "What is a Firewall?",
        options: [
          "A physical temperature sensor for server rooms",
          "A security device or software that controls incoming and outgoing network traffic",
          "A backup application used to restore system files",
          "A router protocol that assigns public IP addresses"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "A security device or software that controls incoming and outgoing network traffic",
        marks: 1
      },
      {
        id: "ch1-t1.14-m3",
        question: "How does a Firewall protect local computers from network attacks?",
        options: [
          "By encrypting the physical hard drive",
          "By acting as a barrier that blocks harmful or unwanted data",
          "By automatically backing up important files",
          "By increasing the Wi-Fi signal range of the router"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "By acting as a barrier that blocks harmful or unwanted data",
        marks: 1
      },
      {
        id: "ch1-t1.14-m4",
        question: "What is Encryption in network security?",
        options: [
          "Splitting a network into multiple smaller subnets",
          "Converting readable data into a secret form to protect it during transfer",
          "Restricting internet access to specific hours of the day",
          "Making physical duplicates of local files"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Converting readable data into a secret form to protect it during transfer",
        marks: 1
      },
      {
        id: "ch1-t1.14-m5",
        question: "In which of the following real-world applications is encryption commonly used to secure data?",
        options: [
          "Offline word editing",
          "Emails and online banking",
          "System disk defragmentation",
          "Physical printer sharing"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Emails and online banking",
        marks: 1
      },
      {
        id: "ch1-t1.14-m6",
        question: "What is the role of Access Control in network security?",
        options: [
          "It balances the network traffic across multiple servers",
          "It decides who can use the network and limits what actions they can perform",
          "It converts digital signals into analog signals suitable for cables",
          "It measures the ping response time of servers"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "It decides who can use the network and limits what actions they can perform",
        marks: 1
      },
      {
        id: "ch1-t1.14-m7",
        question: "What are the most common mechanisms used to enforce Access Control?",
        options: [
          "Ethernet cables and connectors",
          "Usernames and passwords",
          "IP addresses and subnet masks",
          "Ping and ipconfig commands"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Usernames and passwords",
        marks: 1
      },
      {
        id: "ch1-t1.14-m8",
        question: "Which network security threat is defined as software that can damage systems and files?",
        options: [
          "Phishing",
          "Viruses and malware",
          "Denial of Service (DoS)",
          "Subnetting"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Viruses and malware",
        marks: 1
      },
      {
        id: "ch1-t1.14-m9",
        question: "Which threat tricks users into sharing sensitive personal information like passwords?",
        options: [
          "Malware",
          "Phishing",
          "Denial of Service (DoS)",
          "Encryption"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Phishing",
        marks: 1
      },
      {
        id: "ch1-t1.14-m10",
        question: "What is the goal of a Denial of Service (DoS) attack?",
        options: [
          "To encrypt local files for ransom",
          "To stop or disrupt network services",
          "To steal credit card details silently",
          "To clean the router's web interface"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "To stop or disrupt network services",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch1-t1.14-s1",
        question: "Define network security and explain why it is essential for modern homes and organizations.",
        marks: 2
      },
      {
        id: "ch1-t1.14-s2",
        question: "What is a Firewall, and how does it act as a barrier to secure a network?",
        marks: 2
      },
      {
        id: "ch1-t1.14-s3",
        question: "Explain Encryption and state how it protects sensitive data during online banking.",
        marks: 2
      },
      {
        id: "ch1-t1.14-s4",
        question: "What is Access Control, and how do usernames, passwords, and permissions help enforce it?",
        marks: 2
      },
      {
        id: "ch1-t1.14-s5",
        question: "Briefly describe the following security threats: Malware, Phishing, and Denial of Service (DoS) attacks.",
        marks: 2
      }
    ],
    longQuestions: []
  },

  // =========================================================================
  // TOPIC 1.15: DATA BACKUP AND RECOVERY
  // =========================================================================
  {
    id: "cs-ch1-topic-1.15",
    topicNumber: "1.15",
    name: "Data Backup and Recovery",
    mcqs: [
      {
        id: "ch1-t1.15-m1",
        question: "What is a data backup?",
        options: [
          "Deleting older files to free up disk space",
          "Making a copy of important data to protect it from loss or damage",
          "Moving files from physical cables to wireless connections",
          "Encrypting database tables with WPA3 keys"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Making a copy of important data to protect it from loss or damage",
        marks: 1
      },
      {
        id: "ch1-t1.15-m2",
        question: "According to Page 15, what can cause unexpected data loss?",
        options: [
          "Setting up a guest network on a router",
          "Viruses or hardware failure",
          "Using the ping diagnostic tool",
          "Increasing network bandwidth"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Viruses or hardware failure",
        marks: 1
      },
      {
        id: "ch1-t1.15-m3",
        question: "What does \"Data Recovery\" mean?",
        options: [
          "Increasing the storage capacity of a hard drive",
          "The process of getting lost data back from backup copies",
          "Hiding private IP addresses on a local network",
          "Disabling access controls for system users"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "The process of getting lost data back from backup copies",
        marks: 1
      },
      {
        id: "ch1-t1.15-m4",
        question: "How often does the textbook recommend users should back up their data?",
        options: [
          "Only once when buying a new computer",
          "Regularly",
          "Only after a virus attack has occurred",
          "Once a year during maintenance"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Regularly",
        marks: 1
      },
      {
        id: "ch1-t1.15-m5",
        question: "Which type of data backup saves all data at once?",
        options: [
          "Incremental backup",
          "Full backup",
          "Differential backup",
          "Local backup only"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Full backup",
        marks: 1
      },
      {
        id: "ch1-t1.15-m6",
        question: "What does an Incremental backup save?",
        options: [
          "All system data at once",
          "Only the files and data blocks that have changed since the last backup",
          "Website domain names and IP addresses",
          "Only files that are older than one year"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Only the files and data blocks that have changed since the last backup",
        marks: 1
      },
      {
        id: "ch1-t1.15-m7",
        question: "Which backup type saves only the changes made specifically since the last full backup was taken?",
        options: [
          "Incremental backup",
          "Full backup",
          "Differential backup",
          "Cloud backup only"
        ],
        answer: "(c)",
        correctIndex: 2,
        answerKey: "Differential backup",
        marks: 1
      },
      {
        id: "ch1-t1.15-m8",
        question: "Where can data backups be securely stored?",
        options: [
          "On the primary system RAM only",
          "On physical hard drives or cloud storage",
          "On router web interfaces",
          "Inside firewall software modules"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "On physical hard drives or cloud storage",
        marks: 1
      },
      {
        id: "ch1-t1.15-m9",
        question: "Which tool can help recover deleted files on a computer system?",
        options: [
          "Dynamic routing tables",
          "Recovery software",
          "Ping command prompt",
          "Access control lists"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Recovery software",
        marks: 1
      },
      {
        id: "ch1-t1.15-m10",
        question: "What can be used to recover system data and restore settings back to normal?",
        options: [
          "Network Address Translation (NAT)",
          "System restore",
          "Router web interface login",
          "Subnet ID configuration"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "System restore",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch1-t1.15-s1",
        question: "Define data backup and list two common reasons why data loss can occur.",
        marks: 2
      },
      {
        id: "ch1-t1.15-s2",
        question: "What is data recovery, and what role do backup files play in this process?",
        marks: 2
      },
      {
        id: "ch1-t1.15-s3",
        question: "Describe a Full Backup and explain its main disadvantage when performed daily.",
        marks: 2
      },
      {
        id: "ch1-t1.15-s4",
        question: "Compare Incremental Backups and Differential Backups in terms of storage efficiency and speed.",
        marks: 2
      },
      {
        id: "ch1-t1.15-s5",
        question: "State two storage mediums where backups can be saved, and name two methods used to recover system data.",
        marks: 2
      }
    ],
    longQuestions: []
  },

  // =========================================================================
  // TOPIC 1.16: USABILITY AND SECURITY TRADEOFFS
  // =========================================================================
  {
    id: "cs-ch1-topic-1.16",
    topicNumber: "1.16",
    name: "Usability and Security Tradeoffs",
    mcqs: [
      {
        id: "ch1-t1.16-m1",
        question: "What does \"Usability\" mean in computer systems?",
        options: [
          "The maximum hardware weight a device can support",
          "How easy and clear a system is for users to operate",
          "The complexity of the encryption algorithms used",
          "The bandwidth speed of network connections"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "How easy and clear a system is for users to operate",
        marks: 1
      },
      {
        id: "ch1-t1.16-m2",
        question: "Which of the following is a direct result of good system usability?",
        options: [
          "It makes the network completely secure from hacker attacks",
          "It saves time and effort, and improves user satisfaction",
          "It eliminates the need for user passwords",
          "It increases the number of private IP addresses"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "It saves time and effort, and improves user satisfaction",
        marks: 1
      },
      {
        id: "ch1-t1.16-m3",
        question: "What is the primary focus of \"Security\" in computer networks?",
        options: [
          "To make systems simple and easy to learn",
          "To protect systems, devices, and data from unauthorized access, viruses, and hackers",
          "To increase internet download speeds for users",
          "To balance client requests sequentially across servers"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "To protect systems, devices, and data from unauthorized access, viruses, and hackers",
        marks: 1
      },
      {
        id: "ch1-t1.16-m4",
        question: "What happens when you increase the security measures of a computer network?",
        options: [
          "The system automatically becomes much easier to use",
          "It can make systems harder and more complicated to use",
          "The network bandwidth is completely disabled",
          "All physical local cables are disconnected"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "It can make systems harder and more complicated to use",
        marks: 1
      },
      {
        id: "ch1-t1.16-m5",
        question: "Why are very strong passwords considered a usability challenge?",
        options: [
          "They damage the computer's keyboard keys",
          "They are difficult to remember for users",
          "They slow down the physical speed of the processor",
          "They prevent the router from establishing Wi-Fi signals"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "They are difficult to remember for users",
        marks: 1
      },
      {
        id: "ch1-t1.16-m6",
        question: "How do extra login steps (like multi-factor codes) affect system users?",
        options: [
          "They speed up the login process",
          "They slow down users, taking more time and effort",
          "They decrease overall data security",
          "They delete local files automatically"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "They slow down users, taking more time and effort",
        marks: 1
      },
      {
        id: "ch1-t1.16-m7",
        question: "What is the security status of a system that is kept extremely simple with very basic login rules?",
        options: [
          "It is highly secure",
          "Simple systems are easier to use but are less secure",
          "It is completely immune to malware",
          "It cannot connect to the internet"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Simple systems are easier to use but are less secure",
        marks: 1
      },
      {
        id: "ch1-t1.16-m8",
        question: "What is the consequence of completely removing security measures from a system to make it highly usable?",
        options: [
          "The network speed drops to zero",
          "Removing security increases system risk",
          "Users will be unable to log in",
          "Laptops will require physical cables"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Removing security increases system risk",
        marks: 1
      },
      {
        id: "ch1-t1.16-m9",
        question: "What is required to manage both ease-of-use and safety in computer networks?",
        options: [
          "Eliminating usability entirely",
          "A balance is required for safe and easy use",
          "Removing all firewalls and routers",
          "Creating a network without passwords"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "A balance is required for safe and easy use",
        marks: 1
      },
      {
        id: "ch1-t1.16-m10",
        question: "Which scenario represents a usability vs. security tradeoff?",
        options: [
          "Using Ethernet cables instead of Wi-Fi for stability",
          "Enforcing complex passwords and extra login steps, which protect data but slow down users",
          "Upgrading from IPv4 to IPv6 addressing to increase address space",
          "Implementing Round Robin load balancing to prevent server failure"
        ],
        answer: "(b)",
        correctIndex: 1,
        answerKey: "Enforcing complex passwords and extra login steps, which protect data but slow down users",
        marks: 1
      }
    ],
    shortQuestions: [
      {
        id: "ch1-t1.16-s1",
        question: "Define usability in the context of computer networks. List two outcomes of good usability.",
        marks: 2
      },
      {
        id: "ch1-t1.16-s2",
        question: "What is security? What are the main threats that network security protects against?",
        marks: 2
      },
      {
        id: "ch1-t1.16-s3",
        question: "Explain the term trade-off between usability and security using the password complexity example from the textbook.",
        marks: 2
      },
      {
        id: "ch1-t1.16-s4",
        question: "How do extra login verification steps protect system data? What is their impact on the user's experience?",
        marks: 2
      },
      {
        id: "ch1-t1.16-s5",
        question: "Why is finding a \"balance\" between usability and security important for network administrators?",
        marks: 2
      }
    ],
    longQuestions: []
  }
];

export const CHAPTER_1_EXERCISE_LONGS = [
  {
    questionNumber: 1,
    topicNumber: "1.1",
    id: "cs-ch1-lq-1",
    question: "Define a computer network. Explain its importance and uses in daily life. || کمپیوٹر نیٹ ورک کی تعریف کریں۔ روزمرہ زندگی میں اس کی اہمیت اور استعمالات بیان کریں۔",
    marks: 8
  },
  {
    questionNumber: 2,
    topicNumber: "1.2",
    id: "cs-ch1-lq-2",
    question: "Explain network architecture and describe the main components of a computer network. || نیٹ ورک آرکیٹیکچر کی وضاحت کریں اور کمپیوٹر نیٹ ورک کے اہم اجزاء بیان کریں۔",
    marks: 8
  },
  {
    questionNumber: 3,
    topicNumber: "1.6",
    id: "cs-ch1-lq-3",
    question: "What is the OSI model? Explain its layers and their functions. || او ایس آئی (OSI) ماڈل کیا ہے؟ اس کی تہوں (لیئرز) اور ان کے افعال کی وضاحت کریں۔",
    marks: 8
  },
  {
    questionNumber: 4,
    topicNumber: "1.5",
    id: "cs-ch1-lq-4",
    question: "Define network topology. Explain bus, star, ring, and mesh topologies with advantages and disadvantages. || نیٹ ورک ٹوپولوجی کی تعریف کریں۔ بس، سٹار، رنگ اور میش ٹوپولوجیز کی وضاحت فوائد اور نقصانات کے ساتھ کریں۔",
    marks: 8
  },
  {
    questionNumber: 5,
    topicNumber: "1.3",
    id: "cs-ch1-lq-5",
    question: "Explain the types of computer networks. Describe LAN, WAN, and the Internet. || کمپیوٹر نیٹ ورکس کی اقسام کی وضاحت کریں۔ لوکل ایریا نیٹ ورک (LAN)، وائڈ ایریا نیٹ ورک (WAN) اور انٹرنیٹ بیان کریں۔",
    marks: 8
  },
  {
    questionNumber: 6,
    topicNumber: "1.4",
    id: "cs-ch1-lq-6",
    question: "Describe the main networking devices used in a computer network and explain their functions. || کمپیوٹر نیٹ ورک میں استعمال ہونے والے اہم نیٹ ورکنگ آلات بیان کریں اور ان کے افعال کی وضاحت کریں۔",
    marks: 8
  },
  {
    questionNumber: 7,
    topicNumber: "1.7",
    id: "cs-ch1-lq-7",
    question: "What are network protocols? Explain TCP/IP, HTTP, FTP, and DNS. || نیٹ ورک پروٹوکولز کیا ہیں؟ TCP/IP، HTTP، FTP اور DNS کی وضاحت کریں۔",
    marks: 8
  },
  {
    questionNumber: 8,
    topicNumber: "1.8",
    id: "cs-ch1-lq-8",
    question: "Explain IP addressing. Describe IPv4, IPv6, the default gateway, and subnetting. || آئی پی ایڈریسنگ کی وضاحت کریں۔ IPv4، IPv6، ڈیفالٹ گیٹ وے اور سب نیٹنگ بیان کریں۔",
    marks: 8
  }
];
