import { useState } from "react";
import { Button, Card, Badge } from "react-bootstrap";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/dashboard/student/my-projects")({
  component: Component,
});

interface Topic {
  id: number;
  title: string;
  description: string;
  type: "1275" | "Classic";
  teacher: string;
  binomeStatus: "Accepted" | "Pending" | null;
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
    binomeStatus: "Pending",
  },
  {
    id: 2,
    title: "Augmented Reality in Education",
    description:
      "Developing AR applications for immersive learning experiences.",
    type: "1275",
    teacher: "Dr. Marie Curie",
    binomeStatus: "Pending",
  },
  {
    id: 3,
    title: "Blockchain for Secure Voting",
    description:
      "Implementing a blockchain-based solution for secure voting systems.",
    type: "Classic",
    teacher: "Prof. Alan Turing",
    binomeStatus: "Pending",
  },
  {
    id: 4,
    title: "Sustainable Energy Solutions",
    description:
      "Developing innovative solutions for renewable energy and energy efficiency.",
    type: "Classic",
    teacher: "Dr. Albert Einstein",
    binomeStatus: "Pending",
  },
  {
    id: 5,
    title: "Cybersecurity Threat Intelligence",
    description:
      "Building advanced threat intelligence platforms to protect critical infrastructure.",
    type: "1275",
    teacher: "Dr. Grace Hopper",
    binomeStatus: "Pending",
  },
  {
    id: 6,
    title: "Quantum Computing for Drug Discovery",
    description:
      "Utilizing quantum computing to accelerate drug discovery processes.",
    type: "1275",
    teacher: "Dr. Richard Feynman",
    binomeStatus: "Pending",
  },
  {
    id: 7,
    title: "IoT-Enabled Smart Cities",
    description:
      "Developing IoT solutions for intelligent urban infrastructure.",
    type: "1275",
    teacher: "Dr. Nikola Tesla",
    binomeStatus: "Pending",
  },
  {
    id: 8,
    title: "Natural Language Processing for Sentiment Analysis",
    description:
      "Building NLP models to analyze and understand human language.",
    type: "Classic",
    teacher: "Dr. Alan Turing",
    binomeStatus: "Pending",
  },
  {
    id: 9,
    title: "Autonomous Vehicle Navigation Systems",
    description:
      "Developing self-driving car technology for safer and more efficient transportation.",
    type: "1275",
    teacher: "Dr. Elon Musk",
    binomeStatus: "Pending",
  },
  {
    id: 10,
    title: "Bioinformatics for Precision Medicine",
    description:
      "Analyzing biological data to develop personalized medical treatments.",
    type: "Classic",
    teacher: "Dr. Marie Curie",
    binomeStatus: "Pending",
  },
  {
    id: 11,
    title: "Edge Computing for Real-time Applications",
    description:
      "Deploying computing resources closer to data sources for faster processing.",
    type: "1275",
    teacher: "Dr. John McCarthy",
    binomeStatus: "Pending",
  },
];

const proposedTopic = topics.find((topic) => topic.id === 1);
const selectedTopics = topics.filter((topic) => topic.id > 1);

function Component() {
  const [proposed, setProposed] = useState<Topic | null>(proposedTopic || null);
  const [selected, setSelected] = useState<Topic[]>(selectedTopics);

  // Function to delete the proposed topic
  const handleDeleteProposed = () => {
    setProposed(null);
  };

  // Function to delete a selected topic
  const handleDeleteSelected = (topicId: number) => {
    setSelected((prev) => prev.filter((topic) => topic.id !== topicId));
  };

  // Function to change the priority of a selected topic
  const handlePriorityChange = (topicId: number, direction: "up" | "down") => {
    const index = selected.findIndex((topic) => topic.id === topicId);
    if (index === -1) return;

    const newSelected = [...selected];
    if (direction === "up" && index > 0) {
      // Swap with the previous topic
      [newSelected[index - 1], newSelected[index]] = [
        newSelected[index],
        newSelected[index - 1],
      ];
    } else if (direction === "down" && index < newSelected.length - 1) {
      // Swap with the next topic
      [newSelected[index + 1], newSelected[index]] = [
        newSelected[index],
        newSelected[index + 1],
      ];
    }

    setSelected(newSelected);
  };

  return (
    <div>
      <h1 className="text-center mb-5">Your Projects</h1>
      {/* Proposed Topic Section */}
      <div className="mb-5">
        <h3>Proposed Topic</h3>
        <p className="mb-3">
          Here is your proposed project, you can only propose one.
        </p>
        {proposed ? (
          <Card className="w-100 shadow-sm mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                {/* Topic Title, Description, and Binome Status Badge */}
                <div>
                  <Card.Title>{proposed.title}</Card.Title>
                  <Card.Text>{proposed.description}</Card.Text>
                  <Badge
                    bg={
                      proposed.binomeStatus === "Accepted"
                        ? "success"
                        : proposed.binomeStatus === "Pending"
                          ? "warning"
                          : "secondary"
                    }
                    className="mb-2"
                  >
                    {proposed.binomeStatus || "No Binome Assigned"}
                  </Badge>
                </div>

                {/* Edit and Delete Buttons */}
                <div className="d-flex align-items-start">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="me-2 d-flex align-items-center"
                  >
                    <i className="bi bi-pencil-square me-1"></i> Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="d-flex align-items-center"
                    onClick={handleDeleteProposed}
                  >
                    <i className="bi bi-trash me-1"></i> Delete
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        ) : (
          <p>No proposed topic available.</p>
        )}
      </div>

      {/* Selected Topics Section */}
      <div>
        <h3>Selected Topics</h3>
        <p className="mb-3">
          Here are your selected projects, you can delete or change priority.
        </p>
        {selected.length > 0 ? (
          selected.map((topic, index) => (
            <Card key={topic.id} className="w-100 shadow-sm mb-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  {/* Topic Title, Description, and Binome Status Badge */}
                  <div>
                    <Card.Title>{topic.title}</Card.Title>
                    <Card.Text>{topic.description}</Card.Text>
                    <Badge
                      bg={
                        topic.binomeStatus === "Accepted"
                          ? "success"
                          : topic.binomeStatus === "Pending"
                            ? "warning"
                            : "secondary"
                      }
                      className="mb-2"
                    >
                      {topic.binomeStatus || "No Binome Assigned"}
                    </Badge>
                  </div>

                  {/* Priority Change and Delete Buttons */}
                  <div className="d-flex align-items-start">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handlePriorityChange(topic.id, "up")}
                      disabled={index === 0} // Disable if it's the first topic
                    >
                      <i className="bi bi-arrow-up"></i> Up
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handlePriorityChange(topic.id, "down")}
                      disabled={index === selected.length - 1} // Disable if it's the last topic
                    >
                      <i className="bi bi-arrow-down"></i> Down
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteSelected(topic.id)}
                    >
                      <i className="bi bi-trash me-1"></i> Delete
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>No selected topics available.</p>
        )}
      </div>
    </div>
  );
}
