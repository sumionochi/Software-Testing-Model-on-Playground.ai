# Playground AI

Playground AI is a visual workflow platform built to integrate **Gemini Nano's API** for executing multiple AI tasks, managing execution history, and enabling offline or online modes. It empowers users to create scalable AI agent workflows through a simple drag-and-drop interface.

![Screenshot 2024-12-05 035403](https://github.com/user-attachments/assets/2a4931bd-f0d2-43e6-b1c2-ca71611ca735)
![Screenshot 2024-12-05 000637](https://github.com/user-attachments/assets/87aa666e-134c-411c-ac3a-e3255d80d27a)

---

## 🌟 **Inspiration**
The goal of Playground AI is to make Gemini Nano's **offline** and **browser API capabilities** more accessible to a larger audience. The platform encourages developers and non-developers to build AI agent workflows by connecting tasks such as:
- Prompt generation
- Translation
- Language detection
- Writing
- Rewriting
- Summarization

![Screenshot 2024-12-05 035356](https://github.com/user-attachments/assets/87d52a79-d4db-4bff-82a7-fba10223e108)

---

## 🚀 **What It Does**

![pic](https://github.com/user-attachments/assets/f5c1ff01-5ec8-4633-b2cc-24486e03ed41)

Playground AI allows users to:
1. **Create Workflows**:
   - Drag and drop tasks like summarization, translation, and language detection.
   - Define data flow by connecting inputs and outputs.
2. **Execute Workflows**:
   - Run tasks sequentially, where the output of one task serves as input for the next.
3. **Save and Manage Workflows**:
   - Save workflows and execution history for future use.
   - Edit existing workflows and create multiple workflows on the same playground.
4. **Offline and Online Modes**:
   - Use offline mode for workflow creation without requiring internet connectivity.
   - Log in with a Google account to save progress and workflows online.
5. **Handle Task Dependencies**:
   - Prevent invalid connections, such as many-to-many nodes or infinite loops.
6. **Visualize Workflow Execution**:
   - View detailed execution logs for each task via the console.

![Screenshot 2024-12-05 035359](https://github.com/user-attachments/assets/bd7f655c-2677-43af-8dd2-67bc7e69cb19)

---

## 🤝 **Walkthrough**
1. **Login Options**:
   - Start by choosing offline mode or logging in with a Google account.
2. **Building a Smaller Workflow**:
   - Add a **summarization task**, then drag in a **translation task** and a **language detection task**.
   - Connect their endpoints:
     - Output from translation to language detection.
     - Input: English
     - Output: Japanese
   - Add a **prompt generation task** to generate text for summarization.
3. **Executing Workflows**:
   - Enter a prompt, or let the system automatically connect inputs and outputs.
   - Run the workflow to see the sequence of tasks executed in the console.
   - Results include:
     - Generated prompt
     - Summarized content
     - Translated text (e.g., in Japanese)
     - Language detection output
4. **Advanced Features**:
   - Edit workflows and create complex connections.
   - Add multiple workflows to the same playground.
   - Save workflows and access past execution history.

---

## 🏆 **Features**
1. **Visual Workflow Editor**:
   - Drag-and-drop interface for building workflows.
   - Intuitive connections between task inputs and outputs.
2. **Task Execution Engine**:
   - Handles sequential execution of tasks.
   - Manages task dependencies to ensure valid data flow.
3. **Offline Mode**:
   - Full functionality without internet connectivity.
4. **Error Handling and Validation**:
   - Prevents infinite loops and invalid task connections.
5. **Execution History**:
   - Save and manage past workflow execution details.
6. **Multi-Workflow Support**:
   - Create and run multiple workflows simultaneously on the same playground.

---

## 🔑 **Key Functionality**
- **Writing & Rewriting **:
  - Automatically create AI-driven content with shared context and tone, length, format manipulation.
- **Prompt Generation**:
  - Automatically create AI-driven content.
- **Summarization**:
  - Condense input text into concise summaries.
- **Translation**:
  - Translate text from one language to another (e.g., English to Japanese).
- **Language Detection**:
  - Detect the language of a given text input.

---

## 🛠️ **How It Works**
1. **Start with a Workflow**:
   - Add tasks (e.g., summarization, translation).
   - Define the flow by connecting outputs to inputs.
2. **Execute Tasks**:
   - Input data manually or let the system use prior outputs.
   - Run the workflow and monitor task execution in real time.
3. **Visual Feedback**:
   - Use the console to view execution logs for each task.

---

## 🛠️ **Technical Details**

### Frontend
- **React**: For building a dynamic and responsive user interface.
- **React Flow**: For creating the visual workflow editor.
- **TypeScript**: For type-safe, maintainable code.
- **Shadcn/UI**: Consistent and reusable UI components.
- **Sonner**: Toast notifications for user feedback.
- **Lucide Icons**: Intuitive icons for improving usability.

### Backend
- **Node.js and Express**: API server for workflow management.
- **Prisma ORM**: Database management with PostgreSQL.
- **Supabase**: Authentication and real-time database functionality.
- **Gemini Nano APIs**:
  - Integrated for prompt generation, summarization, translation, and language detection.

---

## 🏆 **Accomplishments**
1. Successfully integrated Gemini Nano APIs for multiple AI capabilities.
2. Developed an intuitive drag-and-drop workflow editor.
3. Implemented offline functionality for broader accessibility.
4. Built robust error-handling mechanisms to ensure workflow integrity.
5. Enabled seamless editing and saving of workflows.

---

## 📚 **Lessons Learned**
1. **API Integration**: Combining multiple AI services within workflows.
2. **State Management**: Handling complex state changes in a visual editor.
3. **Offline Functionality**: Providing offline support without sacrificing usability.
4. **User Experience**: The importance of intuitive UI/UX for user engagement.
