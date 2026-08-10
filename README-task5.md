# Task #5: Analysis

## Overview
Each team member will develop a non-trivial feature and integrate it into the project.

**Task:** 
*  Identify bugs, gaps, and technical debt in your bot and start closing the gaps

**Deliverables:**  
You are done with Task 5 if you have conducted an analysis of limitations and weaknesses in your assigned bot by:
1. publishing a report to the main group repository (everyone from the group should contribute to a single report) and  
2. creating user stories drawing from both the problems you've found and any new ideas for improving your bot that arise through this process.  
3. Create a v2.0 Tag in Git  

No artifact turned into Canvas is required. Stride will grade the state of your git repository and project board.  

**Steps:**

1. Divide up the different perspectives on code analysis and code hardening into tasks for each group member, choosing one from the following:
   - Examine your code for technical debt and code smells.  
   - Assess the cyclomatic complexity of the methods in your bot.  
   - Measure your cohesion and coupling (architecture diagrams might help with this!).  
   - Measure your test coverage.  
   - Build a threat model.  
   - Write a fuzzer to try to break functionality in your bot (see Fast-check for a short intro to running fast-check tests in Codespaces).  
   - Unit tests. Write at least 3, these are easy and quick.  
   - Smoke test. If you don't have one already, write a test that will call all the major functions in your bot and verify that core features are working.  
   - Implement continuous integration / continuous deployment for your bot.  
   - Your own idea about what the bot needs  
2. Describe your efforts and findings in a shared code analysis report in your repo.
3. Create user stories associated with your findings (at least 1 per person; you must write out the story yourself).  

**Tips:**
* Think about how your bot has been used so far. What did your testers say? Did anyone try anything that didn't work or wasn't supported? Maybe that's a bug or feature request?  
* Think back to when you were writing the bot. Did you cut any corners or implement something quick and dirty, planning to come back to it later?  
* Think like a bad actor: what happens if you try to break your bot?
* Feel free to use AI tools as a tutor or source for debugging any issues that come up, however you are responsible for the content you turn in.  