import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Card,
  Row,
  Col,
  Badge,
  Button,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";
import { useState } from "react";

export const Route = createLazyFileRoute("/dashboard/student/suggested-topics")(
  {
    component: Component,
  }
);

interface Topic {
  id: number;
  title: string;
  description: string;
  type: "1275" | "Classic";
  teacher: string;
}

// Sample Topics
const topics: Topic[] = [
  {
    id: 1,
    title: "AI-Based Disease Prediction",
    description:
      "A project to use machine learning for early disease prediction.",
    type: "1275",
    teacher: "Dr. Sarah Johnson",
  },
  {
    id: 2,
    title: "Augmented Reality in Education",
    description:
      "Developing AR applications for immersive learning experiences.",
    type: "1275",
    teacher: "Dr. Marie Curie",
  },
  {
    id: 3,
    title: "Blockchain for Secure Voting",
    description:
      "Implementing a blockchain-based solution for secure voting systems.",
    type: "Classic",
    teacher: "Prof. Alan Turing",
  },
  {
    id: 4,
    title: "Sustainable Energy Solutions",
    description:
      "Developing innovative solutions for renewable energy and energy efficiency.",
    type: "Classic",
    teacher: "Dr. Albert Einstein",
  },
  {
    id: 5,
    title: "Cybersecurity Threat Intelligence",
    description:
      "Building advanced threat intelligence platforms to protect critical infrastructure.",
    type: "1275",
    teacher: "Dr. Grace Hopper",
  },
  {
    id: 6,
    title: "Quantum Computing for Drug Discovery",
    description:
      "Utilizing quantum computing to accelerate drug discovery processes.",
    type: "1275",
    teacher: "Dr. Richard Feynman",
  },
  {
    id: 7,
    title: "IoT-Enabled Smart Cities",
    description:
      "Developing IoT solutions for intelligent urban infrastructure.",
    type: "1275",
    teacher: "Dr. Nikola Tesla",
  },
  {
    id: 8,
    title: "Natural Language Processing for Sentiment Analysis",
    description:
      "Building NLP models to analyze and understand human language.",
    type: "Classic",
    teacher: "Dr. Alan Turing",
  },
  {
    id: 9,
    title: "Autonomous Vehicle Navigation Systems",
    description:
      "Developing self-driving car technology for safer and more efficient transportation.",
    type: "1275",
    teacher: "Dr. Elon Musk",
  },
  {
    id: 10,
    title: "Bioinformatics for Precision Medicine",
    description:
      "Analyzing biological data to develop personalized medical treatments.",
    type: "Classic",
    teacher: "Dr. Marie Curie",
  },
  {
    id: 11,
    title: "Edge Computing for Real-time Applications",
    description:
      "Deploying computing resources closer to data sources for faster processing.",
    type: "1275",
    teacher: "Dr. John McCarthy",
  },
  {
    id: 12,
    title: "Machine Learning for Financial Forecasting",
    description: "Using ML algorithms to predict future market trends.",
    type: "Classic",
    teacher: "Dr. Andrew Ng",
  },
  {
    id: 13,
    title: "Virtual and Augmented Reality for Therapy",
    description: "Developing VR/AR experiences for therapeutic interventions.",
    type: "1275",
    teacher: "Dr. Jane Goodall",
  },
  {
    id: 14,
    title: "Blockchain for Supply Chain Transparency",
    description:
      "Implementing blockchain technology to track products through the supply chain.",
    type: "Classic",
    teacher: "Dr. Satoshi Nakamoto",
  },
  {
    id: 15,
    title: "AI-Powered Personal Assistants",
    description:
      "Creating intelligent personal assistants to enhance productivity and convenience.",
    type: "1275",
    teacher: "Dr. Geoffrey Hinton",
  },
];

function Component() {
  // State Management
  const [selectedTopics, setSelectedTopics] = useState<number[]>([]); // Track selected topic IDs
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [binomeEmail, setBinomeEmail] = useState<string>(""); // Binome email
  // const [binomeStatus, setBinomeStatus] = useState<"Pending" | "Accepted" | "Declined" | null>(null); // Binome response

  const handleSelectTopic = (topicId: number) => {
    if (selectedTopics.includes(topicId)) {
      setSelectedTopics((prev) => prev.filter((id) => id !== topicId)); // Deselect
    } else if (selectedTopics.length < 10) {
      setSelectedTopics((prev) => [...prev, topicId]); // Select up to 10 topics
    } else {
      alert("You can select up to 10 topics.");
    }
  };

  const handleConfirmSelection = () => {
    setShowModal(true);
  };

  const handleSubmitBinome = () => {
    console.log("Selected Topics:", selectedTopics);
    console.log("Binome Email:", binomeEmail);

    // setBinomeStatus("Pending");
    setShowModal(false);
  };

  // const handleBinomeResponse = (response: "Accepted" | "Declined") => {
  //   setBinomeStatus(response);
  // };

  return (
    <div>
      <div className="mb-4 d-flex align-items-center justify-content-between">
        <div>
          <h2>Suggested Topics</h2>
          <p>Select up to 10 topics for your project.</p>
          {selectedTopics.length > 0 && (
            <Alert variant="info">
              You have selected {selectedTopics.length} topic(s).
            </Alert>
          )}
        </div>
        {selectedTopics.length > 0 && (
          <Button variant="success" onClick={handleConfirmSelection}>
            Add Binome
          </Button>
        )}
      </div>
      <Row className="gy-4">
        {topics.map((topic) => (
          <Col md={6} key={topic.id}>
            <Card
              className={`h-100 shadow-sm ${
                selectedTopics.includes(topic.id) ? "border-primary" : ""
              }`}
            >
              <Card.Body>
                <Card.Title>{topic.title}</Card.Title>
                <Card.Text className="text-muted">
                  {topic.description}
                </Card.Text>
                <Card.Subtitle className="mb-2 text-muted">
                  Proposed by {topic.teacher}
                </Card.Subtitle>
                <Badge
                  bg={topic.type === "1275" ? "success" : "secondary"}
                  className="mb-2"
                >
                  {topic.type}
                </Badge>
                <div className="text-center mt-3">
                  <Button
                    variant={
                      selectedTopics.includes(topic.id) ? "danger" : "primary"
                    }
                    onClick={() => handleSelectTopic(topic.id)}
                  >
                    {selectedTopics.includes(topic.id) ? "Deselect" : "Select"}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for Binome Selection */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Binome Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="binomeEmail">
              <Form.Label>Enter Binome Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter binome's email"
                value={binomeEmail}
                onChange={(e) => setBinomeEmail(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitBinome}>
            Send Request
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
