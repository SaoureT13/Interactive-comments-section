export function formatDateTime(date) {
  const options = {
    /*month: "long", // Mois complet (par exemple "février")
    day: "numeric", // Jour du mois (par exemple "18")
    year: "numeric", // Année sur quatre chiffres (par exemple "2024")
    */
    hour: "2-digit", // Heure sur deux chiffres (par exemple "08")
    minute: "2-digit", // Minute sur deux chiffres (par exemple "00")
    // second: "2-digit", // Seconde sur deux chiffres (par exemple "00")
    // timeZoneName: "short", // Nom abrégé du fuseau horaire (par exemple "CET")
  };

  return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
}

export function formatCreatedAt(createdAt) {
  const now = new Date();
  const post = new Date(createdAt);

  const timesDifference = now - post;

  const hoursDifference = Math.floor(timesDifference / (1000 * 60 * 60));

  if (hoursDifference < 1) {
    return "Less than 1 hour ago";
  } else if (hoursDifference === 1) {
    return "1 hour ago";
  } else if (hoursDifference < 24) {
    return `${hoursDifference} hours ago`;
  } else {
    const daysDifference = Math.floor(hoursDifference / 24);

    if (daysDifference > 31) {
      const monthsDifference = Math.floor(daysDifference / 31);
      if (monthsDifference > 12) {
        const yearsDifference = Math.floor(monthsDifference / 12);
        return `${yearsDifference} years ago`;
      }
      return `${monthsDifference} months ago`;
    }
    return `${daysDifference} days ago`;
  }
}

let lastId = 0;
export function countId(s) {
  for (let i = 0; i < s.length; i++) {
    if (s[i].id > lastId) {
      lastId = s[i].id;
    }
    if (s[i].replies && s[i].replies.length > 0) {
      countId(s[i].replies);
    }
  }

  return lastId;
}

export function editComment(data, id, newComment) {
  for (const comment of data) {
    if (comment.id === id) {
      comment.content = newComment;
    }

    if (comment.replies.length > 0) {
      for (const reply of comment.replies) {
        if (reply.id === id) {
          reply.content = newComment;
        }
      }
    }
  }
}

export function deleteComment(data, id) {
  const newData = data.filter((comment) => {
    if (comment.id === id) {
      return false;
    }

    if (comment.replies.length > 0) {
      comment.replies = comment.replies.filter((reply) => reply.id !== id);
    }

    return true;
  });

  return newData;
}
