import Cookies from 'js-cookie';

//const url = process.env.NODE_ENV === 'development' ? 'http://localhost:1337' : 'https://uismart.co.uk';
const url = process.env.NODE_ENV === 'development' ? 'http://localhost:1337' : 'https://advisory-dev.herokuapp.com';

function fetchClients(onMessage, sort) {
  return fetch(`${url}/clients`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'))
    .then(data => {
      return data;
    });
}

function fetchCIAProjectData(id, onMessage) {
  return fetch(`${url}/projects/${id}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function createCIA(data, onMessage) {
  return fetch(`${url}/change-impact-assessments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function createKeyActivity(data, onMessage) {
  return fetch(`${url}/key-activities`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function deleteCIA(id, onMessage) {
  return fetch(`${url}/change-impact-assessments/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function updateCIA(id, data, onMessage) {
  return fetch(`${url}/change-impact-assessments/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function updateKeyActivity(id, data, onMessage) {
  return fetch(`${url}/key-activities/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function deleteKeyActivity(id, onMessage) {
  return fetch(`${url}/key-activities/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}
function fetchCIA(id, onMessage) {
  return fetch(`${url}/change-impact-assessments/${id}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchKeyActivitiesonCia(CiaId, onMessage) {
  return fetch(`${url}/key-activities?change_impact_assessment=${CiaId}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchCIAs(onMessage) {
  return fetch(`${url}/change-impact-assessments?project=${Cookies.get('project')}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}
function fetchKeyActivities(pId, onMessage) {
  return fetch(`${url}/key-activities?project=${pId}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchProjects(onMessage, sort) {
  return fetch(`${url}/projects?members.id=${Cookies.get('user')}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'))
    .then(data => {
      if (sort) {
        const userId = parseInt(Cookies.get('user'));
        data.sort((a, b) => {
          if (a.favourited_by.find(user => user.id === userId)) {
            return -1;
          } else if (b.favourited_by.find(user => user.id === userId)) {
            return 1;
          }
          return 0;
        });
      }
      return data;
    })
    .catch(e => onMessage(`Error Sorting`, 'error'));
}

function fetchUsers(onMessage) {
  return fetch(`${url}/users?projects.id=${Cookies.get('project')}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })

    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function updateUser(id, data, onMessage) {
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${Cookies.get('jwt')}`);
  myHeaders.append('Content-Type', 'application/json');

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: JSON.stringify(data),
    redirect: 'follow'
  };

  return fetch(`${url}/users/${id}`, requestOptions)
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function createUser(data, onMessage) {
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${Cookies.get('jwt')}`);
  myHeaders.append('Content-Type', 'application/json');

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(data),
    redirect: 'follow'
  };

  return fetch(`${url}/users`, requestOptions)
    .then(response => {
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function updateClient(id, data, onMessage) {
  return fetch(`${url}/clients/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function updateProject(id, data, onMessage) {
  return fetch(`${url}/projects/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function createProject(data, onMessage) {
  return fetch(`${url}/projects`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function fetchProjectData(id, onMessage) {
  return fetch(`${url}/projects/${id}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchKPIs(onMessage) {
  return fetch(`${url}/kpis?project=${Cookies.get('project')}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function createBusinessUnit(data, onMessage) {
  return fetch(`${url}/business-units`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function updateBusinessUnit(id, data, onMessage) {
  return fetch(`${url}/business-units/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function deleteBusinessUnit(id, onMessage) {
  return fetch(`${url}/business-units/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function createSiteLocation(data, onMessage) {
  return fetch(`${url}/site-locations`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function updateSiteLocation(id, data, onMessage) {
  return fetch(`${url}/site-locations/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function deleteSiteLocation(id, onMessage) {
  return fetch(`${url}/site-locations/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function createKeyLocation(data, onMessage) {
  return fetch(`${url}/key-locations`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function updateKeyLocation(id, data, onMessage) {
  return fetch(`${url}/key-locations/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function deleteKeyLocation(id, onMessage) {
  return fetch(`${url}/key-locations/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function createKPI(data, onMessage) {
  return fetch(`${url}/kpis`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function updateKPI(id, data, onMessage) {
  return fetch(`${url}/kpis/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function deleteKPI(id, onMessage) {
  return fetch(`${url}/kpis/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function createIntervention(data, onMessage) {
  return fetch(`${url}/interventions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: data
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function createQuestionnaireQuestion(data, onMessage) {
  return fetch(`${url}/questionnaire-questions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function updateQuestionnaireQuestion(id, data, onMessage) {
  return fetch(`${url}/questionnaire-questions/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function deleteQuestionnaireQuestion(id, onMessage) {
  return fetch(`${url}/questionnaire-questions/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchChangeJourneyPDF(jobRole, releaseCategory, onMessage) {
  return fetch(
    `${url}/interventions?release_category.category=${releaseCategory}&&persona_job_roles.job_role=${jobRole}&&project=${Cookies.get('project')}`,
    {
      headers: {
        Authorization: `Bearer ${Cookies.get('jwt')}`
      }
    }
  )
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}
function fetchCategoryOnCIA(category_id, cia_id, onMessage) {
  return fetch(`${url}/key-activities?business_change_plan_category=${category_id}&&change_impact_assessment=${cia_id}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function fetchLocationInfrastructure(businessUnit, onMessage) {
  return fetch(`${url}/location-infrastructure`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchInterventionGuides(onMessage) {
  return fetch(`${url}/intervention-guides?project=${Cookies.get('project')}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchMedia(onMessage, mediaURL) {
  return fetch(`${url}${mediaURL}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response;
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function createL2Process(data, onMessage) {
  return fetch(`${url}/l-2-processes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function updateL2Process(id, data, onMessage) {
  return fetch(`${url}/l-2-processes/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function deleteL2Process(id, onMessage) {
  return fetch(`${url}/l-2-processes/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchProjectSpecificL2Process(id, onMessage) {
  return fetch(`${url}/l-2-processes?project.id=${id}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchEmployeeType(onMessage) {
  return fetch(`${url}/target-employees`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function createMaturityQuestion(data, onMessage) {
  return fetch(`${url}/maturity-questions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function updateMaturityQuestion(id, data, onMessage) {
  return fetch(`${url}/maturity-questions/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function deleteMaturityQuestion(id, onMessage) {
  return fetch(`${url}/maturity-questions/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchReleaseCategory(onMessage) {
  return fetch(`${url}/release-categories`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function createQuestionnaireAnswer(data, onMessage) {
  return fetch(`${url}/questionnaire-answers`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function fetchQuestionnaireQuestions(onMessage) {
  return fetch(`${url}/questionnaire-questions?project=${Cookies.get('project')}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function fetchUserProfiles(onMessage, sort) {
  return fetch(`${url}/user-profiles`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'))
    .then(data => {
      if (sort) {
        const userId = parseInt(Cookies.get('user'));
        data.sort((a, b) => {
          if (a.favourited_by.find(user => user.id === userId)) {
            return -1;
          } else if (b.favourited_by.find(user => user.id === userId)) {
            return 1;
          }
          return 0;
        });
      }
      return data;
    })
    .catch(e => onMessage(`Error Sorting`, 'error'));
}

function fetchUserProfilesPerProject(onMessage, sort) {
  return fetch(`${url}/user-profiles?project=${Cookies.get('project')}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'))
    .then(data => {
      if (sort) {
        const userId = parseInt(Cookies.get('user'));
        data.sort((a, b) => {
          if (a.favourited_by.find(user => user.id === userId)) {
            return -1;
          } else if (b.favourited_by.find(user => user.id === userId)) {
            return 1;
          }
          return 0;
        });
      }
      return data;
    })
    .catch(e => onMessage(`Error Sorting`, 'error'));
}

function updateUserProfile(id, data, onMessage) {
  return fetch(`${url}/user-profiles/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}
function fetchQuestionnaireAnswers(userId, onMessage) {
  const userIds = userId.map(key => 'user.id=' + key).join('&');
  return fetch(`${url}/questionnaire-answers?project=${Cookies.get('project')}&${userIds}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}
function fetchMaturityModel(userId, onMessage) {
  const userIds = 'user=' + userId.join();
  return fetch(`${url}/maturity-export?project=${Cookies.get('project')}&${userIds}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchDesignThinking(userId, onMessage) {
  const userIds = 'user=' + userId.join();
  return fetch(`${url}/design-thinking-export?project=${Cookies.get('project')}&${userIds}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchUser(onMessage, user) {
  return fetch(`${url}/users/${user}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}
function createClient(data, onMessage) {
  return fetch(`${url}/clients`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchInterventions(onMessage, sort) {
  return fetch(`${url}/interventions?project=${Cookies.get('project')}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchInterventionReport(onMessage) {
  return fetch(new URL(`interventions-project/${Cookies.get('project')}`, url), {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function updateRolloutTrackers(id, data, onMessage) {
  return fetch(`${url}/rollout-progress-trackers/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchProgressTrackers(user, onMessage) {
  return fetch(`${url}/rollout-progress-trackers?user=${user}&&project=${Cookies.get('project')}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}
function createRollout(data, onMessage) {
  return fetch(`${url}/rollout-progress-trackers`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function fetchFeasibilityVotesPerProcess(l2ProcessId, onMessage) {
  return fetch(`${url}/feasibility-votes?idea.l_2_process=${l2ProcessId}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchAmbitionSettingAnswers(onMessage, user) {
  return fetch(`${url}/questionnaire-answers?user=${user}&&project=${Cookies.get('project')}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchProjectSpecificPerceptions(id, onMessage) {
  return fetch(`${url}/perceptions?project.id=${id}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function createPerception(data, onMessage) {
  return fetch(`${url}/perceptions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function createIdea(data, onMessage) {
  return fetch(`${url}/ideas`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function fetchUserGroups(onMessage, sort) {
  return fetch(`${url}/user-groups`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function fetchUserProfile(profileId, onMessage) {
  return fetch(`${url}/user-profiles/${profileId}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function createUserProfile(res, onMessage) {
  fetch(`${url}/user-profiles/`, {
    method: 'post',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(res)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function updateQuestionnaireAnswers(data, onMessage) {
  return fetch(`${url}/questionnaire-answers/${data.id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}
function fetchKeyLocations(onMessage, project) {
  return fetch(`${url}/key-locations?project=${project}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    })
    .then(data => {
      return data;
    });
}

function fetchBussinessUnits(onMessage) {
  return fetch(`${url}/business-units?projects=${Cookies.get('project')}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    })
    .then(data => {
      return data;
    });
}

function fetchPerceptions(onMessage) {
  return fetch(new URL(`perceptions?user=${Cookies.get('user')}&&project=${Cookies.get('project')}`, url), {
    method: 'get',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchPriorities(onMessage) {
  return fetch(new URL(`priorities?user=${Cookies.get('user')}&&project=${Cookies.get('project')}`, url), {
    method: 'get',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchMaturityRatings(onMessage) {
  return fetch(new URL(`maturity-ratings?user=${Cookies.get('user')}&&project=${Cookies.get('project')}`, url), {
    method: 'get',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchImprovementRatings(onMessage) {
  return fetch(new URL(`improvement-ratings?user=${Cookies.get('user')}&&project=${Cookies.get('project')}`, url), {
    method: 'get',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchIdeasPerProcess(l2ProcessId, onMessage) {
  return fetch(`${url}/ideas?l_2_process=${l2ProcessId}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchValueVotesPerProcess(l2ProcessId, onMessage) {
  return fetch(`${url}/value-votes?idea.l_2_process=${l2ProcessId}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchIdeas(onMessage) {
  return fetch(`${url}/ideas?user=${Cookies.get('user')}&&project=${Cookies.get('project')}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchProjectSpecificIdeas(id, onMessage) {
  return fetch(`${url}/ideas?l_2_process.project=${id}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchFeasibilityVotes(onMessage) {
  return fetch(`${url}/feasibility-votes?user=${Cookies.get('user')}&&project=${Cookies.get('project')}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchValueVotes(onMessage) {
  return fetch(`${url}/value-votes?user=${Cookies.get('user')}&&project=${Cookies.get('project')}`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function createFeasibilityVote(data, onMessage) {
  return fetch(`${url}/feasibility-votes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function createValueVote(data, onMessage) {
  return fetch(`${url}/value-votes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function createIdeaComment(data, onMessage) {
  return fetch(`${url}/idea-comments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchUserRoles(onMessage) {
  return fetch(`${url}/users-permissions/roles`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    })
    .then(data => {
      return data;
    });
}

function fetchSiteLocation(onMessage, project) {
  return fetch(`${url}/site-locations`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    })
    .then(data => {
      return data;
    });
}

function fetchUsersByRole(role, onMessage) {
  return fetch(`${url}/users?projects.id=${Cookies.get('project')}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchTrainingGroups(onMessage) {
  return fetch(`${url}/training-groups?project=${Cookies.get('project')}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchUserTrainings(onMessage) {
  return fetch(`${url}/user-trainings?project=${Cookies.get('project')}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function createUserTraining(data, onMessage) {
  return fetch(`${url}/user-trainings`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function createPersona(data, onMessage) {
  return fetch(`${url}/user-profiles`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function fetchPersonas(onMessage) {
  return fetch(`${url}/user-profiles?project=${Cookies.get('project')}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function fetchChangeReadinessQuestions(onMessage) {
  return fetch(new URL(`change-readiness-questions?project=${Cookies.get('project')}`, url), {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function updatePersona(id, data, onMessage) {
  return fetch(`${url}/user-profiles/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function fetchPersona(id, onMessage) {
  return fetch(`${url}/user-profiles/${id}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchChangeReadinessResponse(onMessage) {
  return fetch(new URL(`change-readiness-responses?user=${Cookies.get('user')}&&project=${Cookies.get('project')}`, url), {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchPersonaSpecificTrainings(personaId, projectId, onMessage) {
  return fetch(`${url}/user-trainings?user_profile=${personaId}&project=${projectId}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchChangeReadinessGraphData(onMessage) {
  return fetch(new URL(`change-readiness-report-project/${Cookies.get('project')}`, url), {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchPersonaSpecificCIAs(personaId, projectId, onMessage) {
  return fetch(`${url}/change-impact-assessments?user_profiles=${personaId}&project=${projectId}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchPersonaSpecificInterventions(jobRoleId, projectId, onMessage) {
  return fetch(`${url}/interventions?persona_job_roles=${jobRoleId}&project=${projectId}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function getFilteredChangeReadinessGraphData(filterData, onMessage) {
  return fetch(
    new URL(
      `change-readiness-report-filter/${Cookies.get('project')}/${filterData.business_unit}/${filterData.location}/${filterData.job_role}`,
      url
    ),
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Cookies.get('jwt')}`
      }
    }
  )
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function getlocationinfrastructurereadinessfilters(filterData, onMessage) {
  return fetch(
    new URL(
      `/location-infrastructure-readinesses-filters/${Cookies.get('project')}/${filterData.business_unit}/${filterData.location}/${
        filterData.Location_task
      }`,
      url
    ),
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Cookies.get('jwt')}`
      }
    }
  )
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchChangeReadinessScore(jobRoleId, projectId, onMessage) {
  return fetch(`${url}/user-profiles-change-readiness-survey/${projectId}/${jobRoleId}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function updateIntervention(id, data, onMessage) {
  return fetch(`${url}/interventions/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: data
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchLocationInfrastructureReadiness(project, bu, location, onMessage) {
  return fetch(`${url}/location-infrastructure-readinesses?project=${project}&&business_unit=${bu}&&key_location=${location}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}
function fetchAllLocationInfrastructureReadiness(project, onMessage) {
  return fetch(`${url}/location-infrastructure-readinesses?project=${project}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchLocationInfrastructureReadinessGraphs(project, onMessage) {
  return fetch(`${url}/location-infrastructure-readinesses-graphs/${project}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function updateLocationInfrastructureReadiness(data, id, onMessage) {
  return fetch(`${url}/location-infrastructure-readinesses/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function createReply(data, onMessage) {
  return fetch(`${url}/replies`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}
function createLike(data, onMessage) {
  return fetch(`${url}/likes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function deleteLike(id, onMessage) {
  return fetch(`${url}/likes/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchEngagements(onMessage) {
  return fetch(`${url}/other-engagement-forms?project=${Cookies.get('project')}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    })
    .then(data => {
      return data;
    });
}

function createEngagementData(data, onMessage) {
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${Cookies.get('jwt')}`);
  myHeaders.append('Content-Type', 'application/json');

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(data),
    redirect: 'follow'
  };

  return fetch(`${url}/other-engagement-forms`, requestOptions)
    .then(response => {
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function updateEngagement(data, onMessage) {
  return fetch(`${url}/other-engagement-forms/${data.id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },

    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchIntervention(id, onMessage) {
  return fetch(`${url}/interventions/${id}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}
function fetchReplies(onMessage) {
  return fetch(`${url}/replies`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchDashboardData(onMessage) {
  return fetch(`${url}/filtered-dashboard-data/${Cookies.get('project')}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchCIAGraphData(onMessage) {
  return fetch(new URL(`change-impact-assessments-project/${Cookies.get('project')}`, url), {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchLocationInfrastructureTasks(project, onMessage) {
  return fetch(`${url}/location-infrastructure-tasks?projects=${project}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}
function getFilteredCIAGraphData(filterData, onMessage) {
  return fetch(
    new URL(
      `change-impact-assessments-filter/${Cookies.get('project')}/${filterData.business_unit}/${filterData.location}/${filterData.profile_name}`,
      url
    ),
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Cookies.get('jwt')}`
      }
    }
  )
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function createLocationInfrastructureReadiness(data, onMessage) {
  return fetch(`${url}/location-infrastructure-readinesses`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchUsersCount(project, bu, location, onMessage) {
  let parturl;
  if (bu == null && location != null) parturl = `${url}/users/count?projects=${project}&&base_location=${location}`;
  else if (bu != null && location == null) parturl = `${url}/users/count?projects=${project}&&business_unit=${bu}`;
  else if (bu != null && location != null) parturl = `${url}/users/count?projects=${project}&&business_unit=${bu}&&base_location=${location}`;
  else parturl = `${url}/users/count?projects=${project}`;
  return fetch(parturl, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })

    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function fetchCategories(onMessage, project) {
  return fetch(`${url}/categories?project=${project}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function fetchSubCategories(categories, onMessage) {
  const categoryIds = categories.map(key => 'category.id=' + key.id).join('&');
  return fetch(`${url}/sub-categories?${categoryIds}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function fetchSpecificSubCategories(category, onMessage) {
  return fetch(`${url}/sub-categories?category=${category}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function fetchActivities(subCategories, onMessage) {
  const subcategoryIds = subCategories.map(key => 'sub_category.id=' + key.id).join('&');
  return fetch(`${url}/activities?${subcategoryIds}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function createSubCategories(data, onMessage) {
  return fetch(`${url}/sub-categories`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function updateActivities(id, data, onMessage) {
  return fetch(`${url}/activities/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: data
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchCategoriesReports(onMessage, category) {
  return fetch(`${url}/categories-report/${Cookies.get('project')}/${category}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function updateSubCategories(id, data, onMessage) {
  return fetch(`${url}/sub-categories/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: data
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function deleteIntervention(id, onMessage) {
  return fetch(`${url}/interventions/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function createActivities(data, onMessage) {
  return fetch(`${url}/activities`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => {
      onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
    });
}

function fetchBusinessCategory(project, onMessage) {
  return fetch(`${url}/business-change-plan-categories?project=${project}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    }
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function createBusinessCategory(data, onMessage) {
  return fetch(`${url}/business-change-plan-categories`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

function updateBusinessCategory(id, data, onMessage) {
  return fetch(`${url}/business-change-plan-categories/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw response;
      return response.json();
    })
    .catch(e => onMessage(`Error ${e.status}: ${e.statusText}`, 'error'));
}

export {
  url,
  fetchProjects,
  updateProject,
  fetchKPIs,
  createKPI,
  createCIA,
  deleteCIA,
  fetchCIA,
  fetchCIAs,
  fetchMaturityModel,
  fetchChangeJourneyPDF,
  fetchInterventionGuides,
  fetchMedia,
  fetchEmployeeType,
  fetchReleaseCategory,
  fetchClients,
  createClient,
  updateClient,
  createProject,
  createQuestionnaireQuestion,
  createL2Process,
  createMaturityQuestion,
  createIntervention,
  createQuestionnaireAnswer,
  fetchQuestionnaireQuestions,
  fetchQuestionnaireAnswers,
  fetchUsers,
  updateUser,
  createUser,
  fetchUser,
  fetchUserProfiles,
  updateUserProfile,
  fetchUserGroups,
  fetchUserRoles,
  fetchUserProfile,
  createUserProfile,
  fetchProjectSpecificL2Process,
  fetchProjectData,
  updateKPI,
  updateQuestionnaireQuestion,
  getlocationinfrastructurereadinessfilters,
  updateL2Process,
  updateMaturityQuestion,
  deleteKPI,
  deleteQuestionnaireQuestion,
  deleteL2Process,
  deleteMaturityQuestion,
  fetchCIAProjectData,
  updateCIA,
  fetchAmbitionSettingAnswers,
  updateQuestionnaireAnswers,
  fetchInterventions,
  fetchInterventionReport,
  fetchLocationInfrastructure,
  fetchLocationInfrastructureReadinessGraphs,
  fetchProjectSpecificPerceptions,
  createPerception,
  fetchIdeas,
  createIdea,
  createPersona,
  fetchPersona,
  fetchPersonas,
  updatePersona,
  fetchKeyLocations,
  fetchBussinessUnits,
  fetchSiteLocation,
  fetchUsersByRole,
  updateRolloutTrackers,
  fetchLocationInfrastructureReadiness,
  updateLocationInfrastructureReadiness,
  fetchPersonaSpecificTrainings,
  fetchPersonaSpecificCIAs,
  fetchPersonaSpecificInterventions,
  fetchCategoryOnCIA,
  createIdeaComment,
  createValueVote,
  createFeasibilityVote,
  getFilteredChangeReadinessGraphData,
  fetchChangeReadinessGraphData,
  fetchChangeReadinessQuestions,
  fetchChangeReadinessResponse,
  fetchChangeReadinessScore,
  fetchIdeasPerProcess,
  fetchPerceptions,
  fetchPriorities,
  fetchMaturityRatings,
  fetchImprovementRatings,
  fetchFeasibilityVotes,
  fetchValueVotes,
  fetchProjectSpecificIdeas,
  fetchTrainingGroups,
  fetchUserTrainings,
  createUserTraining,
  fetchUserProfilesPerProject,
  updateIntervention,
  fetchIntervention,
  createEngagementData,
  updateEngagement,
  createReply,
  fetchReplies,
  createLike,
  fetchProgressTrackers,
  deleteLike,
  createRollout,
  fetchEngagements,
  fetchValueVotesPerProcess,
  fetchFeasibilityVotesPerProcess,
  fetchCIAGraphData,
  getFilteredCIAGraphData,
  fetchDashboardData,
  fetchLocationInfrastructureTasks,
  createLocationInfrastructureReadiness,
  fetchUsersCount,
  fetchCategories,
  fetchSubCategories,
  fetchActivities,
  createSubCategories,
  updateActivities,
  fetchCategoriesReports,
  updateSubCategories,
  fetchSpecificSubCategories,
  createKeyActivity,
  updateKeyActivity,
  deleteKeyActivity,
  fetchKeyActivitiesonCia,
  fetchKeyActivities,
  createActivities,
  deleteIntervention,
  fetchDesignThinking,
  fetchBusinessCategory,
  updateBusinessCategory,
  createBusinessCategory,
  fetchAllLocationInfrastructureReadiness,
  createBusinessUnit,
  updateBusinessUnit,
  deleteBusinessUnit,
  createSiteLocation,
  updateSiteLocation,
  deleteSiteLocation,
  createKeyLocation,
  updateKeyLocation,
  deleteKeyLocation
};
