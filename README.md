# Software Testing Model integration with Playground.ai

**Empowering Automated Unit Test Generation with Specialized Language Models and UniTSyn**

**This web app can currently work on the latest Chrome Dev and Chrome Canary builds. It makes use of on-device, in-browser offline AI (Gemini Nano). For ensuring all features work, follow these steps:**

- go to chrome://flags/#optimization-guide-on-device-model and set it to "Enabled BypassPerfRequirement"
- go to chrome://flags/#text-safety-classifier and disable it.
- enable chrome://flags/#prompt-api-for-gemini-nano, chrome://flags/#summarization-api-for-gemini-nano, chrome://flags/#rewriter-api-for-gemini-nano, chrome://flags/#writer-api-for-gemini-nano, chrome://flags/#language-detection-api
- go to chrome://flags/#translation-api and set it to "Enabled without language pack limit"
- incase of prompt and summarizer api faliure -> paste these in console to force download  
```
await ai.languageModel.create(); 
await ai.summarizer.create(); 
```

**Prerequisites for running locally (create .env file and paste)**

```
Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="<your-supabase-url>"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<your-supabase-anon-key>"

Database Configuration
DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database>?pgbouncer=true&connection_limit=1"
```

---

## Table of Contents

- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [The Solution](#the-solution)
  - [Specialized Language Models (SLM)](#specialized-language-models-slm)
  - [Data Source: UniTSyn](#data-source-unitsyn)
  - [Integration with Playground.ai](#integration-with-playgroundai)
- [How It Works](#how-it-works)
- [Benefits](#benefits)
- [Alignment with OpenLedger’s Goals](#alignment-with-openledgers-goals)
- [References](#references)

---

## Project Overview

**Software Testing Model** is Ideated to be an addition to OpenLedger's upcoming models that leverages **Specialized Language Models (SLM)** trained on the open-source **UniTSyn** dataset to generate high-quality unit tests automatically. By integrating with a developer-friendly drag-and-drop workflow tester - **playground.ai** over blockchain to be hosted on Openledger Testnet, it provides developers with an intuitive interface to enhance, test and build their software testing workflows and so much more.

---

## Problem Statement

While Large Language Models (LLMs) like GPT-4 have shown remarkable capabilities in generating code, their effectiveness in producing accurate and comprehensive unit tests remains limited. Existing LLMs often struggle with generating tests that are both precise and complete because they lack targeted training on test-specific code snippets.

---

## The Solution

### Specialized Language Models (SLM)

It utilize **Specialized Language Models (SLM)** fine-tuned specifically for unit test generation. These models are trained to understand the nuances of software testing, enabling them to produce tests that accurately reflect the intended functionality and edge cases of the code under test.

### Data Source: UniTSyn

**UniTSyn** is a large-scale, open-source dataset designed to enhance the capabilities of language models in unit test synthesis. It comprises 2.7 million focal-test pairs across five mainstream programming languages. By associating tests with their corresponding functions, UniTSyn provides the critical context needed for SLMs to infer expected behaviors and verify logical paths effectively.

**Key Features of UniTSyn:**

- **High Volume**: 2.7 million focal-test pairs.
- **Multi-Language Support**: Covers five mainstream programming languages.
- **Contextual Pairing**: Associates each test with its corresponding function for better understanding.
- **Open-Source Repository**: Access the dataset and contribute via The [GitHub repository](https://github.com/SecurityLab-UCD/UniTSyn).

For an in-depth understanding, refer to The research paper: [Automated Unit Test Generation with UniTSyn](https://arxiv.org/abs/2402.03396).

### Integration with Playground.ai

By integrating The SLM trained on UniTSyn with **playground.ai**, It offer developers a seamless and interactive environment to generate, test, enhance and build unit tests effortlessly. 

Playground AI is a visual workflow platform built to integrate **Gemini Nano's API** for executing multiple AI tasks, managing execution history, and enabling offline or online modes. It empowers users to create scalable AI agent workflows while generating units tests through a simple drag-and-drop interface.

---

## How It Works

1. **Data Preparation**: UniTSyn collects focal-test pairs by leveraging the Language Server Protocol, ensuring accurate associations between functions and their tests without the need for per-project execution setups or language-specific heuristics.

2. **Model Training**: The SLM is fine-tuned on the UniTSyn dataset, enabling it to understand the intricacies of unit testing across different programming languages.

3. **Integration with Playground.ai**:
   - **User Input**: Developers provide function descriptions or code snippets via playground.ai’s intuitive UI.
   - **Test Generation**: The integrated SLM processes the input and generates corresponding unit tests.
   - **Output**: Generated tests are displayed within playground.ai, allowing for easy review and integration into the codebase.
- **Play**: Generate, test, enhance and build unit tests effortlessly

4. **Continuous Improvement**: Feedback from generated tests is used to further refine the SLM, ensuring ongoing enhancements in test accuracy and coverage.

---

## Benefits

- **Enhanced Test Accuracy**: Generates precise and comprehensive unit tests tailored to the provided functions.
- **Time Efficiency**: Automates the tedious process of writing unit tests, allowing developers to focus on core functionalities.
- **Multi-Language Support**: Capable of generating tests across multiple programming languages, catering to diverse development environments through translation and language detection api of gemini nano in-browser AI.
- **Open-Source Collaboration**: Utilizes the open-source UniTSyn dataset, fostering community-driven improvements and transparency.

---

## Alignment with OpenLedger’s Goals

Openledger is a data blockchain for AI that provides infrastructure for creating specialized language models. By leveraging datanets to collect and curate data, Openledger enables the development of these models, which are then consumed by AI agents, chatbots, copilots, and various other applications.

- **Promoting Open Data**: Leveraging the open-source UniTSyn as data source dataset to enhance model training.
- **Enhancing Collaboration**: Inviting developers to contribute, build upon and improve the SLM through Playground.ai to be hosted on Openledger Testnet to not only generate, test, enhance and build unit tests effortlessly but utilize coming soon models from Openledger -> building workflows.

---

## References

- **Research Paper**: [Automated Unit Test Generation with UniTSyn](https://arxiv.org/abs/2402.03396)
- **GitHub Repository**: [UniTSyn by SecurityLab-UCD](https://github.com/SecurityLab-UCD/UniTSyn)
